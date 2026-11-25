import AsyncStorage from '../utils/storage.js';
import { getFirestore, collection, getDocs, getDoc, doc, addDoc, query, orderBy } from 'firebase/firestore';
import { app, FIREBASE_ENABLED } from '../config/firebase.js';
import { mockReviews } from './mockData.js';

export const REVIEWS_KEY = 'hunihub_reviews';
const REVIEWS_COLLECTION = 'reviews';

async function getMockReviews() {
  const raw = await AsyncStorage.getItem(REVIEWS_KEY);
  if (raw) return JSON.parse(raw);
  await persistMockReviews(mockReviews);
  return mockReviews;
}

async function persistMockReviews(reviews) {
  await AsyncStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
}

export async function addReview({ listingId, reviewerId, reviewerName, rating, comment }) {
  const review = {
    id: FIREBASE_ENABLED ? null : 'rv-' + Date.now(),
    listingId,
    reviewerId,
    reviewerName,
    rating,
    comment,
    createdAt: new Date().toISOString(),
  };
  if (FIREBASE_ENABLED) {
    try {
      const db = getFirestore(app);
      const docRef = await addDoc(collection(db, REVIEWS_COLLECTION), review);
      return { ...review, id: docRef.id };
    } catch (err) {
      console.warn('Gagal simpan ulasan ke Firestore, disimpan ke lokal:', err.message);
    }
  }
  const reviews = await getMockReviews();
  reviews.unshift(review);
  await persistMockReviews(reviews);
  return review;
}

export async function getReviewsForListing(listingId) {
  if (FIREBASE_ENABLED) {
    try {
      const db = getFirestore(app);
      const snapshot = await getDocs(
        query(collection(db, REVIEWS_COLLECTION), orderBy('createdAt', 'desc'))
      );
      const reviews = snapshot.docs
        .map((item) => ({ id: item.id, ...item.data() }))
        .filter((item) => item.listingId === listingId);
      if (reviews.length > 0) return reviews;
    } catch (err) {
      console.warn('Gagal membaca ulasan dari Firestore, beralih ke mock:', err.message);
    }
  }
  const reviews = await getMockReviews();
  return reviews.filter((item) => item.listingId === listingId);
}