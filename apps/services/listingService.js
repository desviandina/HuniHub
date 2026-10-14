import { getFirestore, collection, getDocs, getDoc, doc, addDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { app, FIREBASE_ENABLED } from '../config/firebase';
import { mockListings, mockOwners } from './mockData';

const LISTINGS_COLLECTION = 'listings';

function applyFilters(listings, filters = {}) {
  let result = [...listings];
  if (filters.type) {
    result = result.filter((item) => item.type === filters.type);
  }
  if (filters.maxPrice) {
    result = result.filter((item) => item.price <= Number(filters.maxPrice));
  }
  if (filters.city) {
    const keyword = filters.city.trim().toLowerCase();
    result = result.filter((item) => item.location.toLowerCase().includes(keyword));
  }
  if (filters.sortBy === 'priceAsc') {
    result.sort((a, b) => a.price - b.price);
  } else if (filters.sortBy === 'priceDesc') {
    result.sort((a, b) => b.price - a.price);
  } else if (filters.sortBy === 'rating') {
    result.sort((a, b) => b.rating - a.rating);
  }
  return result;
}

function toMockListingWithOwner(listing) {
  const owner = mockOwners[listing.ownerId] || { name: 'Pemilik' };
  return { ...listing, ownerName: owner.name };
}

const withTimeout = (promise, ms = 1200) =>
  Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Koneksi Firestore timeout')), ms)
    ),
  ]);

export async function searchListings(filters = {}) {
  if (FIREBASE_ENABLED) {
    try {
      const db = getFirestore(app);
      const ref = collection(db, LISTINGS_COLLECTION);
      const constraints = [];
      if (filters.type) {
        constraints.push(where('type', '==', filters.type));
      }
      const snapshot = await withTimeout(getDocs(query(ref, ...constraints)));
      const items = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
      if (items.length > 0) {
        return applyFilters(items, filters);
      }
      console.warn('Firestore listings kosong, beralih menampilkan mock data.');
    } catch (err) {
      console.warn('Gagal membaca Firestore, beralih ke mock data:', err.message);
    }
  }
  const listings = mockListings.map(toMockListingWithOwner).filter((item) => item.available);
  return applyFilters(listings, filters);
}

export async function getListingById(id) {
  if (FIREBASE_ENABLED) {
    try {
      const db = getFirestore(app);
      const snapshot = await withTimeout(getDoc(doc(db, LISTINGS_COLLECTION, id)));
      if (snapshot.exists()) {
        return { id: snapshot.id, ...snapshot.data() };
      }
    } catch (err) {
      console.warn('Gagal membaca Firestore getListingById, beralih ke mock data:', err.message);
    }
  }
  const listing = mockListings.find((item) => item.id === id);
  return listing ? toMockListingWithOwner(listing) : null;
}

export async function getListingsByOwner(ownerId) {
  if (FIREBASE_ENABLED) {
    try {
      const db = getFirestore(app);
      const snapshot = await withTimeout(
        getDocs(query(collection(db, LISTINGS_COLLECTION), where('ownerId', '==', ownerId)))
      );
      if (snapshot.docs.length > 0) {
        return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
      }
    } catch (err) {
      console.warn('Gagal membaca Firestore getListingsByOwner, beralih ke mock data:', err.message);
    }
  }
  return mockListings.filter((item) => item.ownerId === ownerId);
}

export async function createListing(data) {
  if (FIREBASE_ENABLED) {
    try {
      const db = getFirestore(app);
      const created = await addDoc(collection(db, LISTINGS_COLLECTION), {
        ...data,
        createdAt: new Date().toISOString(),
        available: true,
      });
      return { id: created.id, ...data };
    } catch (err) {
      console.warn('Gagal menyimpan ke Firestore, disimpan secara lokal:', err.message);
    }
  }
  return { id: 'mock-' + Date.now(), ...data, available: true };
}

export async function updateListing(id, data) {
  if (FIREBASE_ENABLED) {
    try {
      const db = getFirestore(app);
      await updateDoc(doc(db, LISTINGS_COLLECTION, id), data);
    } catch (err) {
      console.warn('Gagal update Firestore:', err.message);
    }
  }
  return { id, ...data };
}

export async function deleteListing(id) {
  if (FIREBASE_ENABLED) {
    try {
      const db = getFirestore(app);
      await deleteDoc(doc(db, LISTINGS_COLLECTION, id));
    } catch (err) {
      console.warn('Gagal delete Firestore:', err.message);
    }
  }
  return { id };
}