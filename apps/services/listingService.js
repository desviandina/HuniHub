import AsyncStorage from '../utils/storage.js';
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from 'firebase/firestore';
import { app, FIREBASE_ENABLED } from '../config/firebase.js';
import { mockListings, mockOwners } from './mockData.js';
import { PROPERTY_CATEGORIES, AVAILABILITY_STATUS } from '../constants/listing.js';

export const LISTINGS_STORAGE_KEY = 'hunihub_listings';
export const STORAGE_VERSION_KEY = 'hunihub_listings_version';
export const CURRENT_VERSION = '3.0-multirole-aceh-barat';
const LISTINGS_COLLECTION = 'listings';

const ALLOWED_CATEGORIES = [
  PROPERTY_CATEGORIES.KOST,
  PROPERTY_CATEGORIES.HOMESTAY,
  PROPERTY_CATEGORIES.SEWA_RUMAH,
];

export async function getListingsFromStorage() {
  try {
    const version = await AsyncStorage.getItem(STORAGE_VERSION_KEY);
    const raw = await AsyncStorage.getItem(LISTINGS_STORAGE_KEY);

    // If version is outdated or storage empty, seed fresh Aceh Barat data
    if (version !== CURRENT_VERSION || !raw) {
      const normalizedMock = mockListings.map((item) => ({
        ...item,
        availabilityStatus: item.availabilityStatus || (item.available !== false ? AVAILABILITY_STATUS.AVAILABLE : AVAILABILITY_STATUS.UNAVAILABLE),
        rentalDuration: item.rentalDuration || 'bulan',
      }));
      await AsyncStorage.setItem(LISTINGS_STORAGE_KEY, JSON.stringify(normalizedMock));
      await AsyncStorage.setItem(STORAGE_VERSION_KEY, CURRENT_VERSION);
      return normalizedMock;
    }

    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }

    await AsyncStorage.setItem(LISTINGS_STORAGE_KEY, JSON.stringify(mockListings));
    return mockListings;
  } catch (err) {
    console.warn('Gagal membaca storage hunian, gunakan mock in-memory:', err);
    return mockListings;
  }
}

export async function saveListingsToStorage(listings) {
  try {
    await AsyncStorage.setItem(LISTINGS_STORAGE_KEY, JSON.stringify(listings));
  } catch (err) {
    console.warn('Gagal menyimpan ke storage hunian:', err);
  }
}

function applyFilters(listings, filters = {}) {
  let result = [...listings];
  if (filters.type) {
    result = result.filter((item) => item.type === filters.type);
  }
  if (filters.maxPrice) {
    result = result.filter((item) => Number(item.price) <= Number(filters.maxPrice));
  }
  if (filters.city) {
    const keyword = filters.city.trim().toLowerCase();
    result = result.filter(
      (item) =>
        (item.location && item.location.toLowerCase().includes(keyword)) ||
        (item.title && item.title.toLowerCase().includes(keyword)) ||
        (item.description && item.description.toLowerCase().includes(keyword)) ||
        (item.nearbyPlaces && item.nearbyPlaces.some((p) => p.name?.toLowerCase().includes(keyword)))
    );
  }
  if (filters.sortBy === 'priceAsc') {
    result.sort((a, b) => Number(a.price) - Number(b.price));
  } else if (filters.sortBy === 'priceDesc') {
    result.sort((a, b) => Number(b.price) - Number(a.price));
  } else if (filters.sortBy === 'rating') {
    result.sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0));
  }
  return result;
}

function attachOwnerName(listing) {
  if (listing.ownerName) return listing;
  const owner = mockOwners[listing.ownerId] || { name: 'Pemilik Hunian' };
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
  let localListings = await getListingsFromStorage();

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
    } catch (err) {
      console.warn('Firestore offline/fallback ke local data:', err.message);
    }
  }

  const listings = localListings.map(attachOwnerName).filter((item) => item.available !== false);
  return applyFilters(listings, filters);
}

export async function getListingById(id) {
  if (FIREBASE_ENABLED) {
    try {
      const db = getFirestore(app);
      const snapshot = await withTimeout(getDoc(doc(db, LISTINGS_COLLECTION, id)));
      if (snapshot.exists()) {
        return attachOwnerName({ id: snapshot.id, ...snapshot.data() });
      }
    } catch (err) {
      console.warn('Firestore fallback getListingById:', err.message);
    }
  }

  const localListings = await getListingsFromStorage();
  const found = localListings.find((item) => String(item.id) === String(id));
  return found ? attachOwnerName(found) : null;
}

/**
 * Strict owner property retrieval - Never display another owner's properties
 */
export async function getListingsByOwner(ownerId) {
  if (!ownerId) return [];

  if (FIREBASE_ENABLED) {
    try {
      const db = getFirestore(app);
      const snapshot = await withTimeout(
        getDocs(query(collection(db, LISTINGS_COLLECTION), where('ownerId', '==', ownerId)))
      );
      if (snapshot.docs.length > 0) {
        return snapshot.docs.map((item) => attachOwnerName({ id: item.id, ...item.data() }));
      }
      return [];
    } catch (err) {
      console.warn('Gagal membaca Firestore getListingsByOwner:', err.message);
    }
  }

  const localListings = await getListingsFromStorage();
  const owned = localListings.filter((item) => String(item.ownerId) === String(ownerId)).map(attachOwnerName);
  return owned;
}

export async function createListing(data) {
  if (!data.title?.trim() || !data.price) {
    throw new Error('Nama hunian dan harga sewa wajib diisi.');
  }

  const normalizedCategory = data.type || PROPERTY_CATEGORIES.HOMESTAY;
  if (!ALLOWED_CATEGORIES.includes(normalizedCategory)) {
    throw new Error(`Kategori hunian tidak valid. Hanya mendukung: Kost, Homestay, atau Sewa Rumah.`);
  }

  const availabilityStatus = data.availabilityStatus || AVAILABILITY_STATUS.AVAILABLE;
  const isAvailable = availabilityStatus === AVAILABILITY_STATUS.AVAILABLE;

  const newListing = {
    id: 'l-' + Date.now(),
    title: data.title.trim(),
    type: normalizedCategory,
    price: Number(data.price) || 0,
    rentalDuration: data.rentalDuration || 'bulan',
    location: data.location?.trim() || 'Johan Pahlawan, Meulaboh, Aceh Barat',
    description: data.description?.trim() || '',
    facilities: data.facilities || [],
    nearbyPlaces: data.nearbyPlaces || [],
    images:
      data.images && data.images.length > 0
        ? data.images
        : [
            'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
          ],
    ownerId: data.ownerId,
    ownerName: data.ownerName || 'Pemilik Hunian',
    lat: data.lat !== undefined ? Number(data.lat) : 4.1440,
    lng: data.lng !== undefined ? Number(data.lng) : 96.1280,
    distanceKm: data.distanceKm !== undefined ? Number(data.distanceKm) : 0.8,
    rating: 5.0,
    reviewCount: 0,
    available: isAvailable,
    availabilityStatus: availabilityStatus,
    createdAt: new Date().toISOString(),
  };

  if (!newListing.ownerId) {
    throw new Error('User ID pemilik hunian tidak valid.');
  }

  if (FIREBASE_ENABLED) {
    try {
      const db = getFirestore(app);
      const created = await addDoc(collection(db, LISTINGS_COLLECTION), newListing);
      newListing.id = created.id;
    } catch (err) {
      console.warn('Gagal menyimpan ke Firestore, disimpan ke storage lokal:', err.message);
    }
  }

  const localListings = await getListingsFromStorage();
  localListings.unshift(newListing);
  await saveListingsToStorage(localListings);

  return newListing;
}

export async function updateListing(id, data, currentUserId) {
  const localListings = await getListingsFromStorage();
  const existing = localListings.find((item) => String(item.id) === String(id));

  if (!existing) {
    throw new Error('Hunian tidak ditemukan.');
  }

  // Security Ownership Check
  if (currentUserId && String(existing.ownerId) !== String(currentUserId)) {
    throw new Error('Akses ditolak: Anda tidak memiliki izin untuk mengubah hunian milik pengguna lain.');
  }

  if (data.type && !ALLOWED_CATEGORIES.includes(data.type)) {
    throw new Error(`Kategori hunian tidak valid. Hanya mendukung: Kost, Homestay, atau Sewa Rumah.`);
  }

  const updatedData = { ...data };
  if (data.availabilityStatus) {
    updatedData.available = data.availabilityStatus === AVAILABILITY_STATUS.AVAILABLE;
  }

  if (FIREBASE_ENABLED) {
    try {
      const db = getFirestore(app);
      await updateDoc(doc(db, LISTINGS_COLLECTION, id), updatedData);
    } catch (err) {
      console.warn('Gagal update Firestore:', err.message);
    }
  }

  const updatedListings = localListings.map((item) =>
    String(item.id) === String(id) ? { ...item, ...updatedData } : item
  );
  await saveListingsToStorage(updatedListings);

  return { id, ...existing, ...updatedData };
}

export async function deleteListing(id, currentUserId) {
  const localListings = await getListingsFromStorage();
  const existing = localListings.find((item) => String(item.id) === String(id));

  if (!existing) {
    throw new Error('Hunian tidak ditemukan.');
  }

  // Security Ownership Check
  if (currentUserId && String(existing.ownerId) !== String(currentUserId)) {
    throw new Error('Akses ditolak: Anda tidak memiliki izin untuk menghapus hunian milik pengguna lain.');
  }

  if (FIREBASE_ENABLED) {
    try {
      const db = getFirestore(app);
      await deleteDoc(doc(db, LISTINGS_COLLECTION, id));
    } catch (err) {
      console.warn('Gagal delete Firestore:', err.message);
    }
  }

  const filtered = localListings.filter((item) => String(item.id) !== String(id));
  await saveListingsToStorage(filtered);

  return { id };
}

export async function updateListingRating(id, newRating) {
  const localListings = await getListingsFromStorage();
  const target = localListings.find((item) => String(item.id) === String(id));
  if (!target) return;

  const currentCount = target.reviewCount || 0;
  const currentRating = target.rating || 5;
  const updatedCount = currentCount + 1;
  const updatedRating = Number(
    ((currentRating * currentCount + Number(newRating)) / updatedCount).toFixed(1)
  );

  await updateListing(id, {
    rating: updatedRating,
    reviewCount: updatedCount,
  });
}
