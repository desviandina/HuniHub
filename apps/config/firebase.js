import { initializeApp, getApps, getApp } from 'firebase/app';
import { FIREBASE_ENABLED, firebaseConfig } from './environment';

function getFirebaseApp() {
  if (!FIREBASE_ENABLED) {
    return null;
  }
  return getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
}

export const app = getFirebaseApp();
export { FIREBASE_ENABLED };