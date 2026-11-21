import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithCredential,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
} from 'firebase/firestore';
import { app, FIREBASE_ENABLED } from '../config/firebase';
import { googleConfig } from '../config/environment';
import { ROLES } from '../constants/roles';

export const SESSION_KEY = 'hunihub_session';

const delay = (ms = 40) => new Promise((resolve) => setTimeout(resolve, ms));

function normalizeUser(firebaseUser, role) {
  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Pengguna',
    role,
    photoURL: firebaseUser.photoURL,
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
      role: user.role,
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

function getMockUid(email, role) {
  const lower = (email || '').toLowerCase().trim();
  if (lower === 'rudi@hunihub.test' || lower === 'rudi@gmail.com') return 'o1';
  if (lower === 'sari@hunihub.test') return 'o2';
  if (lower === 'doni@hunihub.test') return 'o3';
  if (lower === 'alya@hunihub.test' || lower === 'alya@gmail.com') return 'u1';
  if (role === ROLES.OWNER) return 'o1';
  const sanitized = lower.replace(/[^a-z0-9]/g, '_');
  return sanitized ? `user_${sanitized}` : 'u1';
}

export async function registerWithEmail({ email, password, name, role }) {
  const normalizedRole = ROLES[role] ? role : ROLES.SEEKER;
  if (FIREBASE_ENABLED) {
    const auth = getAuth(app);
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    await saveProfile(normalizeUser(credential.user, normalizedRole));
    return normalizeUser(credential.user, normalizedRole);
  }
  await delay();
  const lowerEmail = (email || '').toLowerCase().trim();
  const session = {
    uid: getMockUid(lowerEmail, normalizedRole),
    email: lowerEmail,
    name: name || lowerEmail.split('@')[0],
    role: normalizedRole,
    isMock: true,
  };
  return persistSession(session);
}

export async function loginWithEmail({ email, password, role }) {
  const normalizedRole = ROLES[role] ? role : ROLES.SEEKER;
  if (FIREBASE_ENABLED) {
    const auth = getAuth(app);
    const credential = await signInWithEmailAndPassword(auth, email, password);
    const profile = await getDoc(doc(getFirestore(app), 'profiles', credential.user.uid));
    const savedRole = profile.exists() ? profile.data().role : normalizedRole;
    return normalizeUser(credential.user, savedRole);
  }
  await delay();
  const lowerEmail = (email || '').toLowerCase().trim();
  const demoUsers = {
    'rudi@hunihub.test': { uid: 'o1', name: 'Pak Rudi', role: ROLES.OWNER },
    'rudi@gmail.com': { uid: 'o1', name: 'Pak Rudi', role: ROLES.OWNER },
    'sari@hunihub.test': { uid: 'o2', name: 'Bu Sari', role: ROLES.OWNER },
    'doni@hunihub.test': { uid: 'o3', name: 'Mas Doni', role: ROLES.OWNER },
    'alya@hunihub.test': { uid: 'u1', name: 'Alya Putri', role: ROLES.SEEKER },
    'alya@gmail.com': { uid: 'u1', name: 'Alya Putri', role: ROLES.SEEKER },
  };

  const matched = demoUsers[lowerEmail];
  const session = {
    uid: getMockUid(lowerEmail, normalizedRole),
    email: lowerEmail,
    name: matched?.name || lowerEmail.split('@')[0],
    role: matched?.role || normalizedRole,
    isMock: true,
  };
  return persistSession(session);
}

export async function loginWithGoogle(role) {
  const normalizedRole = ROLES[role] ? role : ROLES.SEEKER;
  if (FIREBASE_ENABLED) {
    const { GoogleSignin } = require('@react-native-google-signin/google-signin');
    GoogleSignin.configure({
      webClientId: googleConfig.webClientId,
    });
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();
    const credential = GoogleAuthProvider.credential(userInfo.idToken);
    const auth = getAuth(app);
    const result = await signInWithCredential(auth, credential);
    await saveProfile(normalizeUser(result.user, normalizedRole));
    return normalizeUser(result.user, normalizedRole);
  }
  await delay();
  const isOwner = normalizedRole === ROLES.OWNER;
  const session = {
    uid: isOwner ? 'o1' : 'u1',
    email: isOwner ? 'rudi@hunihub.test' : 'alya@hunihub.test',
    name: isOwner ? 'Pak Rudi' : 'Alya Putri',
    role: normalizedRole,
    isMock: true,
  };
  return persistSession(session);
}

export async function logout() {
  if (FIREBASE_ENABLED) {
    const auth = getAuth(app);
    if (auth.currentUser) {
      await signOut(auth);
    }
  }
  // Hanya hapus sesi aktif saat logout agar data permintaan sewa,
  // notifikasi, dan hunian tetap tersimpan saat berganti akun
  await AsyncStorage.removeItem(SESSION_KEY);
}

export async function forgotPassword(email) {
  if (FIREBASE_ENABLED) {
    const auth = getAuth(app);
    await sendPasswordResetEmail(auth, email);
    return;
  }
  // Mock mode: resolve without error (email would be sent in real env)
  await delay();
}