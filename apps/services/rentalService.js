import AsyncStorage from '@react-native-async-storage/async-storage';
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
import { app, FIREBASE_ENABLED } from '../config/firebase';
import { RENTAL_STATUS } from '../constants/listing';
import { pushNotification } from './notificationService';

export const REQUESTS_KEY = 'hunihub_requests';
const REQUESTS_COLLECTION = 'rentalRequests';

function generateMockRequestId() {
  return 'req-' + Date.now();
}

async function getMockRequests() {
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

async function persistMockRequests(requests) {
  await AsyncStorage.setItem(REQUESTS_KEY, JSON.stringify(requests));
}

export async function checkDuplicateRequest(seekerId, listingId) {
  const requests = await getMockRequests();
  const targetSeekerId = seekerId || 'u1';
  return requests.some(
    (item) =>
      (item.seekerId === targetSeekerId || (targetSeekerId === 'u1' && item.seekerId === 'u1')) &&
      String(item.listingId) === String(listingId) &&
      item.status === RENTAL_STATUS.PENDING
  );
}

export async function createRentalRequest({
  listingId,
  seekerId,
  seekerName,
  ownerId,
  listingTitle,
  startDate,
  endDate,
  durationDays,
  totalPrice,
}) {
  const targetOwnerId = ownerId || 'o1';
  const targetSeekerId = seekerId || 'u1';

  const request = {
    id: FIREBASE_ENABLED ? null : generateMockRequestId(),
    listingId,
    seekerId: targetSeekerId,
    seekerName: seekerName || 'Penyewa',
    ownerId: targetOwnerId,
    listingTitle,
    startDate,
    endDate,
    durationDays,
    totalPrice,
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

  const requests = await getMockRequests();
  requests.unshift(request);
  await persistMockRequests(requests);

  // Send transactional notifications to both owner and seeker
  try {
    // Notification to owner
    await pushNotification({
      userId: targetOwnerId,
      title: 'Permintaan Sewa Baru 📋',
      body: `Ada pengajuan sewa baru untuk "${listingTitle}" dari ${seekerName || 'Penyewa'}. Segera periksa di tab Permintaan.`,
      createdAt: new Date().toISOString(),
      action: 'go_to_requests',
    });

    // Confirmation notification to seeker
    await pushNotification({
      userId: targetSeekerId,
      title: 'Pengajuan Sewa Terkirim 🚀',
      body: `Permintaan sewa untuk "${listingTitle}" berhasil dikirim. Menunggu konfirmasi pemilik hunian.`,
      createdAt: new Date().toISOString(),
      action: 'go_to_history',
    });
  } catch (notifErr) {
    console.warn('Gagal mengirim notifikasi otomatis sewa:', notifErr);
  }

  return request;
}

export async function getRequestsBySeeker(seekerId) {
  if (FIREBASE_ENABLED) {
    try {
      const db = getFirestore(app);
      const snapshot = await getDocs(
        query(collection(db, REQUESTS_COLLECTION), where('seekerId', '==', seekerId))
      );
      if (snapshot.docs.length > 0) {
        return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
      }
    } catch (err) {
      console.warn('Gagal membaca permintaan sewa seeker dari Firestore, beralih ke lokal:', err.message);
    }
  }
  const requests = await getMockRequests();
  if (!seekerId) return requests;
  return requests.filter(
    (item) => item.seekerId === seekerId || item.seekerId === 'u1' || item.seekerId === 'u2'
  );
}

export async function getRequestsByOwner(ownerId) {
  if (FIREBASE_ENABLED) {
    try {
      const db = getFirestore(app);
      const snapshot = await getDocs(
        query(collection(db, REQUESTS_COLLECTION), where('ownerId', '==', ownerId))
      );
      if (snapshot.docs.length > 0) {
        return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
      }
    } catch (err) {
      console.warn('Gagal membaca permintaan sewa owner dari Firestore, beralih ke lokal:', err.message);
    }
  }
  const requests = await getMockRequests();
  if (!ownerId) return requests;
  return requests.filter(
    (item) => item.ownerId === ownerId || item.ownerId === 'o1' || ownerId === 'o1' || !item.ownerId
  );
}

export async function updateRequestStatus(id, status) {
  if (FIREBASE_ENABLED) {
    try {
      const db = getFirestore(app);
      await updateDoc(doc(db, REQUESTS_COLLECTION, id), { status });
    } catch (err) {
      console.warn('Gagal update status permintaan di Firestore, update ke lokal:', err.message);
    }
  }
  const requests = await getMockRequests();
  let targetRequest = null;
  const updated = requests.map((item) => {
    if (item.id === id) {
      targetRequest = { ...item, status };
      return targetRequest;
    }
    return item;
  });
  await persistMockRequests(updated);

  // Send notification to seeker regarding the decision
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

export async function cancelRequest(id) {
  return updateRequestStatus(id, RENTAL_STATUS.CANCELED);
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
  const requests = await getMockRequests();
  return requests.find((item) => item.id === id) || null;
}
