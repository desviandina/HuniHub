import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore, collection, getDocs, getDoc, doc, setDoc, updateDoc, query, where } from 'firebase/firestore';
import { app, FIREBASE_ENABLED } from '../config/firebase';
import { RENTAL_STATUS } from '../constants/listing';

export const REQUESTS_KEY = 'hunihub_requests';
const REQUESTS_COLLECTION = 'rentalRequests';

function generateMockRequestId() {
  return 'req-' + Date.now();
}

async function getMockRequests() {
  const raw = await AsyncStorage.getItem(REQUESTS_KEY);
  return raw ? JSON.parse(raw) : [];
}

async function persistMockRequests(requests) {
  await AsyncStorage.setItem(REQUESTS_KEY, JSON.stringify(requests));
}

export async function createRentalRequest({ listingId, seekerId, ownerId, listingTitle, startDate, durationDays, totalPrice }) {
  const request = {
    id: FIREBASE_ENABLED ? null : generateMockRequestId(),
    listingId,
    seekerId,
    ownerId,
    listingTitle,
    startDate,
    durationDays,
    totalPrice,
    status: RENTAL_STATUS.PENDING,
    createdAt: new Date().toISOString(),
  };
  if (FIREBASE_ENABLED) {
    try {
      const db = getFirestore(app);
      const created = await setDoc(doc(collection(db, REQUESTS_COLLECTION)), request);
      return { ...request, id: created.id };
    } catch (err) {
      console.warn('Gagal menyimpan permintaan sewa ke Firestore, disimpan ke lokal:', err.message);
    }
  }
  const requests = await getMockRequests();
  requests.unshift(request);
  await persistMockRequests(requests);
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
  return requests.filter((item) => item.seekerId === seekerId);
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
  return requests.filter((item) => item.ownerId === ownerId);
}

export async function updateRequestStatus(id, status) {
  if (FIREBASE_ENABLED) {
    try {
      const db = getFirestore(app);
      await updateDoc(doc(db, REQUESTS_COLLECTION, id), { status });
      return { id, status };
    } catch (err) {
      console.warn('Gagal update status permintaan di Firestore, update ke lokal:', err.message);
    }
  }
  const requests = await getMockRequests();
  const updated = requests.map((item) => (item.id === id ? { ...item, status } : item));
  await persistMockRequests(updated);
  return { id, status };
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