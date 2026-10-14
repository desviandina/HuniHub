import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
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

const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

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

export async function registerWithEmail({ email, password, name, role }) {
  const normalizedRole = ROLES[role] ? role : ROLES.SEEKER;
  if (FIREBASE_ENABLED) {
    const auth = getAuth(app);
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    await saveProfile(normalizeUser(credential.user, normalizedRole));
    return normalizeUser(credential.user, normalizedRole);
  }
  await delay();
  const session = {
    uid: 'mock-' + Date.now(),
    email,
    name: name || email.split('@')[0],
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
  const lowerEmail = email.toLowerCase().trim();
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
    uid: matched?.uid || (normalizedRole === ROLES.OWNER ? 'o1' : 'mock-' + Date.now()),
    email,
    name: matched?.name || email.split('@')[0],
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
  const session = {
    uid: 'mock-google-' + Date.now(),
    email: 'alya@gmail.com',
    name: 'Alya Putri',
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
  await clearStoredSession();
}