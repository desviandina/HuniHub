import AsyncStorage from '../utils/storage.js';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
} from 'firebase/firestore';
import { app, FIREBASE_ENABLED } from '../config/firebase.js';
import { ROLES } from '../constants/roles.js';

export const SESSION_KEY = 'hunihub_session';
export const USERS_DB_KEY = 'hunihub_users_db';
export const ACTIVE_MODE_PREFIX = 'hunihub_active_mode_';

const delay = (ms = 40) => new Promise((resolve) => setTimeout(resolve, ms));

const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;

export function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  return emailRegex.test(email.trim());
}

const DEFAULT_DEMO_USERS = {
  'rudi@hunihub.test': { uid: 'o1', name: 'Pak Rudi', email: 'rudi@hunihub.test', password: 'password123', defaultMode: ROLES.OWNER },
  'rudi@gmail.com': { uid: 'o1', name: 'Pak Rudi', email: 'rudi@gmail.com', password: 'password123', defaultMode: ROLES.OWNER },
  'sari@hunihub.test': { uid: 'o2', name: 'Bu Sari', email: 'sari@hunihub.test', password: 'password123', defaultMode: ROLES.OWNER },
  'doni@hunihub.test': { uid: 'o3', name: 'Mas Doni', email: 'doni@hunihub.test', password: 'password123', defaultMode: ROLES.OWNER },
  'alya@hunihub.test': { uid: 'u1', name: 'Alya Putri', email: 'alya@hunihub.test', password: 'password123', defaultMode: ROLES.SEEKER },
  'alya@gmail.com': { uid: 'u1', name: 'Alya Putri', email: 'alya@gmail.com', password: 'password123', defaultMode: ROLES.SEEKER },
};

async function getLocalUsersDb() {
  try {
    const raw = await AsyncStorage.getItem(USERS_DB_KEY);
    if (!raw) {
      await AsyncStorage.setItem(USERS_DB_KEY, JSON.stringify(DEFAULT_DEMO_USERS));
      return { ...DEFAULT_DEMO_USERS };
    }
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_DEMO_USERS, ...parsed };
  } catch (err) {
    return { ...DEFAULT_DEMO_USERS };
  }
}

async function saveLocalUser(userRecord) {
  try {
    const users = await getLocalUsersDb();
    users[userRecord.email.toLowerCase()] = userRecord;
    await AsyncStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
  } catch (err) {
    console.warn('Gagal menyimpan user ke local DB:', err);
  }
}

function normalizeUser(firebaseUser, activeMode) {
  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Pengguna',
    activeMode: activeMode || ROLES.SEEKER,
    role: activeMode || ROLES.SEEKER, // Maintain role property for compatibility
    photoURL: firebaseUser.photoURL || '',
    isMock: false,
  };
}

async function saveProfile(user) {
  const db = getFirestore(app);
  const profileRef = doc(db, 'profiles', user.uid);
  const existing = await getDoc(profileRef);
  if (!existing.exists()) {
    await setDoc(profileRef, {
      uid: user.uid,
      email: user.email,
      name: user.name,
      activeMode: user.activeMode,
      role: user.activeMode,
      createdAt: new Date().toISOString(),
      photoURL: user.photoURL || '',
    });
  }
}

async function persistSession(session) {
  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export function getStoredSession() {
  return AsyncStorage.getItem(SESSION_KEY).then((raw) =>
    raw ? JSON.parse(raw) : null
  );
}

export function clearStoredSession() {
  return AsyncStorage.removeItem(SESSION_KEY);
}

export async function registerWithEmail({ email, password, name, initialMode = ROLES.SEEKER }) {
  const trimmedName = (name || '').trim();
  const lowerEmail = (email || '').toLowerCase().trim();

  if (!trimmedName) {
    throw new Error('Nama lengkap wajib diisi.');
  }

  if (!isValidEmail(lowerEmail)) {
    throw new Error('Format email tidak valid. Masukkan email yang benar (contoh: user@domain.com).');
  }

  if (!password || password.length < 6) {
    throw new Error('Password minimal harus terdiri dari 6 karakter.');
  }

  const activeMode = initialMode === ROLES.OWNER ? ROLES.OWNER : ROLES.SEEKER;

  if (FIREBASE_ENABLED) {
    const auth = getAuth(app);
    const credential = await createUserWithEmailAndPassword(auth, lowerEmail, password);
    const userObj = normalizeUser(credential.user, activeMode);
    userObj.name = trimmedName;
    await saveProfile(userObj);
    await AsyncStorage.setItem(`${ACTIVE_MODE_PREFIX}${userObj.uid}`, activeMode);
    return persistSession(userObj);
  }

  await delay();
  const users = await getLocalUsersDb();

  // Check duplicate email
  if (users[lowerEmail]) {
    throw new Error('Email sudah terdaftar. Silakan gunakan email lain atau masuk ke akun Anda.');
  }

  const newUid = 'usr_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 6);
  const newRecord = {
    uid: newUid,
    email: lowerEmail,
    name: trimmedName,
    password,
    activeMode,
    createdAt: new Date().toISOString(),
  };

  await saveLocalUser(newRecord);
  await AsyncStorage.setItem(`${ACTIVE_MODE_PREFIX}${newUid}`, activeMode);

  const session = {
    uid: newUid,
    email: lowerEmail,
    name: trimmedName,
    activeMode,
    role: activeMode,
    isMock: true,
  };

  return persistSession(session);
}

export async function loginWithEmail({ email, password }) {
  const lowerEmail = (email || '').toLowerCase().trim();

  if (!isValidEmail(lowerEmail)) {
    throw new Error('Format email tidak valid.');
  }

  if (!password) {
    throw new Error('Password wajib diisi.');
  }

  if (FIREBASE_ENABLED) {
    const auth = getAuth(app);
    const credential = await signInWithEmailAndPassword(auth, lowerEmail, password);
    const profileSnap = await getDoc(doc(getFirestore(app), 'profiles', credential.user.uid));
    const savedProfile = profileSnap.exists() ? profileSnap.data() : {};

    // Check if user has a persisted active mode preference on this device
    const localActiveMode = await AsyncStorage.getItem(`${ACTIVE_MODE_PREFIX}${credential.user.uid}`);
    const activeMode = localActiveMode || savedProfile.activeMode || savedProfile.role || ROLES.SEEKER;

    const userObj = normalizeUser(credential.user, activeMode);
    if (savedProfile.name) userObj.name = savedProfile.name;
    return persistSession(userObj);
  }

  await delay();
  const users = await getLocalUsersDb();
  const matched = users[lowerEmail];

  if (!matched) {
    throw new Error('Email tidak terdaftar. Periksa kembali email Anda atau buat akun baru.');
  }

  // Password check for local mock accounts
  if (matched.password && matched.password !== password) {
    throw new Error('Password yang Anda masukkan salah. Silakan coba lagi.');
  }

  const savedMode = await AsyncStorage.getItem(`${ACTIVE_MODE_PREFIX}${matched.uid}`);
  const activeMode = savedMode || matched.activeMode || matched.defaultMode || ROLES.SEEKER;

  const session = {
    uid: matched.uid,
    email: lowerEmail,
    name: matched.name || lowerEmail.split('@')[0],
    activeMode,
    role: activeMode,
    isMock: true,
  };

  return persistSession(session);
}

export async function switchMode(currentSession, newMode) {
  if (!currentSession) return null;
  const targetMode = newMode === ROLES.OWNER ? ROLES.OWNER : ROLES.SEEKER;

  const updatedSession = {
    ...currentSession,
    activeMode: targetMode,
    role: targetMode,
  };

  // Persist updated session and per-user active mode
  await persistSession(updatedSession);
  await AsyncStorage.setItem(`${ACTIVE_MODE_PREFIX}${currentSession.uid}`, targetMode);

  // Update in local user db
  try {
    const users = await getLocalUsersDb();
    if (users[currentSession.email.toLowerCase()]) {
      users[currentSession.email.toLowerCase()].activeMode = targetMode;
      await AsyncStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
    }
  } catch (err) {
    console.warn('Gagal sinkronkan mode ke database lokal:', err);
  }

  // Update in Firestore if enabled
  if (FIREBASE_ENABLED && !currentSession.isMock) {
    try {
      const db = getFirestore(app);
      await updateDoc(doc(db, 'profiles', currentSession.uid), {
        activeMode: targetMode,
        role: targetMode,
      });
    } catch (err) {
      console.warn('Gagal update activeMode di Firestore:', err.message);
    }
  }

  return updatedSession;
}

export async function logout() {
  if (FIREBASE_ENABLED) {
    const auth = getAuth(app);
    if (auth.currentUser) {
      await signOut(auth);
    }
  }
  // Remove session on logout, but keep listings, requests, and per-user mode saved
  await AsyncStorage.removeItem(SESSION_KEY);
}

export async function forgotPassword(email) {
  const lower = (email || '').toLowerCase().trim();
  if (!isValidEmail(lower)) {
    throw new Error('Format email tidak valid.');
  }

  if (FIREBASE_ENABLED) {
    const auth = getAuth(app);
    await sendPasswordResetEmail(auth, lower);
    return;
  }

  await delay();
  const users = await getLocalUsersDb();
  if (!users[lower]) {
    throw new Error('Alamat email belum terdaftar di HuniHub.');
  }
}
