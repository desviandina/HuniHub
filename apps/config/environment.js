const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

const googleConfig = {
  mapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
};

const FORCE_MOCK = process.env.EXPO_PUBLIC_USE_MOCK === 'true';

const FIREBASE_ENABLED = !FORCE_MOCK && Boolean(
  firebaseConfig.apiKey &&
    firebaseConfig.projectId &&
    !firebaseConfig.apiKey.startsWith('REPLACE_WITH')
);

const MAPS_ENABLED = Boolean(
  googleConfig.mapsApiKey && !googleConfig.mapsApiKey.startsWith('REPLACE_WITH')
);

export { firebaseConfig, googleConfig, FIREBASE_ENABLED, MAPS_ENABLED };