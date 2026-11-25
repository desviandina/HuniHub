import AsyncStorage from '../utils/storage.js';
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  query,
  where,
} from 'firebase/firestore';
import { app, FIREBASE_ENABLED } from '../config/firebase.js';
import { RENTAL_STATUS, AVAILABILITY_STATUS } from '../constants/listing.js';
import { pushNotification } from './notificationService.js';
import { getListingById } from './listingService.js';

export const REQUESTS_KEY = 'hunihub_requests';
const REQUESTS_COLLECTION = 'rentalRequests';

function generateRequestId() {
  return 'req-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6);
}

async function getStoredRequests() {
  const raw = await AsyncStorage.getItem(REQUESTS_KEY);
  if (!raw) {
    const initialSeed = [
      {
        id: 'req-demo-1',
        listingId: 'l2',
        seekerId: 'u1',
        seekerName: 'Alya Putri',
        ownerId: 'o1',
        listingTitle: 'Kost Putri Teuku Umar Asri',
        startDate: '2026-11-25',
        endDate: '2026-12-25',
        durationDays: 30,
        totalPrice: 650000,
        status: RENTAL_STATUS.PENDING,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'req-demo-2',
        listingId: 'l1',
        seekerId: 'u2',
        seekerName: 'Rahmat Pratama',
        ownerId: 'o1',
        listingTitle: 'Homestay Meulaboh Indah',
        startDate: '2026-11-20',
        endDate: '2026-11-23',
        durationDays: 3,
        totalPrice: 350000,
        status: RENTAL_STATUS.ACCEPTED,
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
    ];
    await AsyncStorage.setItem(REQUESTS_KEY, JSON.stringify(initialSeed));
    return initialSeed;
  }
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function persistRequests(requests) {
  await AsyncStorage.setItem(REQUESTS_KEY, JSON.stringify(requests));
}

export async function checkDuplicateRequest(seekerId, listingId) {
  if (!seekerId || !listingId) return false;
  const requests = await getStoredRequests();
  return requests.some(
    (item) =>
      String(item.seekerId) === String(seekerId) &&
      String(item.listingId) === String(listingId) &&
      item.status === RENTAL_STATUS.PENDING
  );
}

export async function createRentalRequest({
  listingId,
  seekerId,
  seekerName,
  startDate,
  endDate,
  durationDays,
  totalPrice,
}) {
  if (!seekerId) {
    throw new Error('Anda harus masuk sebagai penyewa untuk mengajukan sewa.');
  }

  if (!listingId) {
    throw new Error('ID hunian tidak valid.');
  }

  // Verify listing exists and is available
  const listing = await getListingById(listingId);
  if (!listing) {
    throw new Error('Hunian yang diajukan tidak ditemukan.');
  }

  // Prevent owner from renting own property
  if (String(listing.ownerId) === String(seekerId)) {
    throw new Error('Anda adalah pemilik hunian ini. Tidak dapat mengajukan sewa pada properti sendiri.');
  }

  // Check availability status
  if (
    (listing.availabilityStatus && listing.availabilityStatus !== AVAILABILITY_STATUS.AVAILABLE) ||
    listing.available === false
  ) {
    throw new Error('Hunian ini sedang tidak tersedia untuk pengajuan sewa baru.');
  }

  // Check duplicate pending request
  const isDuplicate = await checkDuplicateRequest(seekerId, listingId);
  if (isDuplicate) {
    throw new Error('Anda sudah memiliki pengajuan sewa yang sedang menunggu konfirmasi untuk hunian ini.');
  }

  const targetOwnerId = listing.ownerId || 'o1';

  const request = {
    id: generateRequestId(),
    listingId,
    seekerId,
    seekerName: seekerName || 'Penyewa',
    ownerId: targetOwnerId,
    listingTitle: listing.title,
    startDate,
    endDate,
    durationDays,
    totalPrice: Number(totalPrice) || 0,
    status: RENTAL_STATUS.PENDING,
    createdAt: new Date().toISOString(),
  };

  if (FIREBASE_ENABLED) {
    try {
      const db = getFirestore(app);
      const docRef = await addDoc(collection(db, REQUESTS_COLLECTION), request);
      request.id = docRef.id;
    } catch (err) {
      console.warn('Gagal menyimpan permintaan sewa ke Firestore, disimpan ke lokal:', err.message);
    }
  }

  const requests = await getStoredRequests();
  requests.unshift(request);
  await persistRequests(requests);

  // Send notifications
  try {
    // To owner
    await pushNotification({
      userId: targetOwnerId,
      title: 'Permintaan Sewa Baru 📋',
      body: `Ada pengajuan sewa baru untuk "${listing.title}" dari ${seekerName || 'Penyewa'}. Segera periksa di tab Permintaan.`,
      createdAt: new Date().toISOString(),
      action: 'go_to_requests',
    });

    // To seeker
    await pushNotification({
      userId: seekerId,
      title: 'Pengajuan Sewa Terkirim 🚀',
      body: `Permintaan sewa untuk "${listing.title}" berhasil dikirim. Menunggu konfirmasi pemilik hunian.`,
      createdAt: new Date().toISOString(),
      action: 'go_to_history',
    });
  } catch (notifErr) {
    console.warn('Gagal mengirim notifikasi otomatis sewa:', notifErr);
  }

  return request;
}

/**
 * Strict seeker requests retrieval - Only returns applications submitted by this authenticated seeker
 */
export async function getRequestsBySeeker(seekerId) {
  if (!seekerId) return [];

  if (FIREBASE_ENABLED) {
    try {
      const db = getFirestore(app);
      const snapshot = await getDocs(
        query(collection(db, REQUESTS_COLLECTION), where('seekerId', '==', seekerId))
      );
      if (snapshot.docs.length > 0) {
        return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
      }
      return [];
    } catch (err) {
      console.warn('Gagal membaca permintaan sewa seeker dari Firestore, beralih ke lokal:', err.message);
    }
  }

  const requests = await getStoredRequests();
  return requests.filter((item) => String(item.seekerId) === String(seekerId));
}

/**
 * Strict owner requests retrieval - Only returns applications for properties owned by this authenticated owner
 */
export async function getRequestsByOwner(ownerId) {
  if (!ownerId) return [];

  if (FIREBASE_ENABLED) {
    try {
      const db = getFirestore(app);
      const snapshot = await getDocs(
        query(collection(db, REQUESTS_COLLECTION), where('ownerId', '==', ownerId))
      );
      if (snapshot.docs.length > 0) {
        return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
      }
      return [];
    } catch (err) {
      console.warn('Gagal membaca permintaan sewa owner dari Firestore, beralih ke lokal:', err.message);
    }
  }

  const requests = await getStoredRequests();
  return requests.filter((item) => String(item.ownerId) === String(ownerId));
}

export async function updateRequestStatus(id, status, currentUserId) {
  const requests = await getStoredRequests();
  const existing = requests.find((item) => String(item.id) === String(id));

  if (!existing) {
    throw new Error('Permintaan sewa tidak ditemukan.');
  }

  // Authorization check
  if (currentUserId) {
    if (status === RENTAL_STATUS.CANCELED && String(existing.seekerId) !== String(currentUserId)) {
      throw new Error('Akses ditolak: Hanya pemohon sewa yang dapat membatalkan pengajuan ini.');
    }
    if (
      (status === RENTAL_STATUS.ACCEPTED || status === RENTAL_STATUS.REJECTED || status === RENTAL_STATUS.COMPLETED) &&
      String(existing.ownerId) !== String(currentUserId)
    ) {
      throw new Error('Akses ditolak: Hanya pemilik hunian yang berwenang mengubah status pengajuan ini.');
    }
  }

  if (FIREBASE_ENABLED) {
    try {
      const db = getFirestore(app);
      await updateDoc(doc(db, REQUESTS_COLLECTION, id), { status });
    } catch (err) {
      console.warn('Gagal update status permintaan di Firestore, update ke lokal:', err.message);
    }
  }

  let targetRequest = null;
  const updated = requests.map((item) => {
    if (String(item.id) === String(id)) {
      targetRequest = { ...item, status };
      return targetRequest;
    }
    return item;
  });
  await persistRequests(updated);

  // Send status update notification to seeker
  if (targetRequest && targetRequest.seekerId) {
    try {
      if (status === RENTAL_STATUS.ACCEPTED) {
        await pushNotification({
          userId: targetRequest.seekerId,
          title: 'Permintaan Sewa Disetujui! 🎉',
          body: `Kabar baik! Pemilik hunian telah menyetujui pengajuan sewa untuk "${targetRequest.listingTitle}".`,
          createdAt: new Date().toISOString(),
          action: 'go_to_history',
        });
      } else if (status === RENTAL_STATUS.REJECTED) {
        await pushNotification({
          userId: targetRequest.seekerId,
          title: 'Permintaan Sewa Ditolak ⚠️',
          body: `Mohon maaf, pengajuan sewa untuk "${targetRequest.listingTitle}" belum dapat diterima oleh pemilik.`,
          createdAt: new Date().toISOString(),
          action: 'go_to_history',
        });
      } else if (status === RENTAL_STATUS.COMPLETED) {
        await pushNotification({
          userId: targetRequest.seekerId,
          title: 'Masa Sewa Selesai ✅',
          body: `Masa sewa untuk "${targetRequest.listingTitle}" telah selesai. Terima kasih telah menggunakan HuniHub!`,
          createdAt: new Date().toISOString(),
          action: 'go_to_history',
        });
      }
    } catch (notifErr) {
      console.warn('Gagal mengirim notifikasi status sewa:', notifErr);
    }
  }

  return { id, status };
}

export async function cancelRequest(id, seekerId) {
  return updateRequestStatus(id, RENTAL_STATUS.CANCELED, seekerId);
}

export async function getRequestById(id) {
  if (FIREBASE_ENABLED) {
    try {
      const db = getFirestore(app);
      const snapshot = await getDoc(doc(db, REQUESTS_COLLECTION, id));
      if (snapshot.exists()) {
        return { id: snapshot.id, ...snapshot.data() };
      }
    } catch (err) {
      console.warn('Gagal membaca getRequestById dari Firestore, beralih ke lokal:', err.message);
    }
  }
  const requests = await getStoredRequests();
  return requests.find((item) => String(item.id) === String(id)) || null;
}
