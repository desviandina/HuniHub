const fs = require('fs');
const path = require('path');
const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc } = require('firebase/firestore');

// Membaca file .env manual tanpa dependency tambahan
function loadEnv() {
  const envPath = path.resolve(__dirname, '..', '.env');
  if (!fs.existsSync(envPath)) return {};
  const content = fs.readFileSync(envPath, 'utf-8');
  const env = {};
  content.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        const key = trimmed.slice(0, idx).trim();
        const val = trimmed.slice(idx + 1).trim();
        env[key] = val;
      }
    }
  });
  return env;
}

const env = loadEnv();

const firebaseConfig = {
  apiKey: env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

if (!firebaseConfig.apiKey || firebaseConfig.apiKey.startsWith('REPLACE_WITH')) {
  console.error('Konfigurasi Firebase belum diisi di apps/.env!');
  process.exit(1);
}

const sampleListings = [
  {
    id: 'l1',
    title: 'Homestay Griya Alya',
    type: 'homestay',
    price: 350000,
    location: 'Jl. Malioboro No. 12, Yogyakarta',
    distanceKm: 0.8,
    rating: 4.8,
    reviewCount: 23,
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
    ],
    facilities: ['WiFi', 'AC', 'Parkir', 'Dapur', 'Sarapan'],
    description:
      'Homestay nyaman di pusat kota, 5 menit dari Malioboro. Cocok untuk liburan singkat maupun menginap beberapa hari.',
    ownerId: 'o1',
    ownerName: 'Pak Rudi',
    lat: -7.7956,
    lng: 110.3695,
    available: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'l2',
    title: 'Kost Putri Mawar',
    type: 'kost',
    price: 900000,
    location: 'Jl. Kaliurang KM 5, Sleman, Yogyakarta',
    distanceKm: 6.4,
    rating: 4.5,
    reviewCount: 41,
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80',
    ],
    facilities: ['Kamar Mandi Dalam', 'WiFi', 'Listrik 24 Jam', 'Laundry'],
    description:
      'Kost khusus putri di kawasan kampus, nyaman dan aman. Dekat dengan kampus UGM.',
    ownerId: 'o1',
    ownerName: 'Pak Rudi',
    lat: -7.7699,
    lng: 110.4058,
    available: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'l3',
    title: 'Rumah Sewa Joglo Asri',
    type: 'rumah',
    price: 2500000,
    location: 'Jl. Prawirotaman No. 8, Yogyakarta',
    distanceKm: 2.1,
    rating: 4.9,
    reviewCount: 15,
    images: [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    ],
    facilities: ['2 Kamar Tidur', 'Dapur', 'Garasi', 'AC', 'Air Sumur'],
    description:
      'Rumah sewa bergaya joglo di area Prawirotaman, dekat dengan tempat wisata dan kuliner.',
    ownerId: 'o2',
    ownerName: 'Bu Sari',
    lat: -7.8017,
    lng: 110.3648,
    available: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'l4',
    title: 'Homestay Pantai Balekambang',
    type: 'homestay',
    price: 450000,
    location: 'Jl. Pantai Balekambang, Malang',
    distanceKm: 1.5,
    rating: 4.6,
    reviewCount: 32,
    images: [
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
    ],
    facilities: ['AC', 'WiFi', 'Parkir', 'Water Heater'],
    description:
      'Homestay dengan pemandangan laut, 5 menit berjalan kaki ke Pantai Balekambang.',
    ownerId: 'o2',
    ownerName: 'Bu Sari',
    lat: -8.4037,
    lng: 112.5375,
    available: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'l5',
    title: 'Kost Eksklusif Bandung',
    type: 'kost',
    price: 1200000,
    location: 'Jl. Dago Asri No. 3, Bandung',
    distanceKm: 3.2,
    rating: 4.7,
    reviewCount: 28,
    images: [
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
    ],
    facilities: ['AC', 'Kamar Mandi Dalam', 'WiFi', 'Dapur Bersama'],
    description:
      'Kost eksklusif di Dago, fasilitas lengkap, lingkungan asri dan tenang.',
    ownerId: 'o3',
    ownerName: 'Mas Doni',
    lat: -6.8687,
    lng: 107.6293,
    available: true,
    createdAt: new Date().toISOString(),
  },
];

async function seed() {
  console.log('Menghubungkan ke Firebase project:', firebaseConfig.projectId);
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  console.log(`Mengisi ${sampleListings.length} data hunian ke Firestore...`);
  for (const item of sampleListings) {
    await setDoc(doc(db, 'listings', item.id), item);
    console.log(`+ Tersimpan: [${item.type}] ${item.title}`);
  }
  console.log('\nSeed Firestore berhasil selesai!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('\nGagal melakukan seed Firestore:', err.message);
  if (err.message.includes('PERMISSION_DENIED') || err.message.includes('Cloud Firestore API')) {
    console.error('\nTips: Pastikan Cloud Firestore Database sudah di-create di Firebase Console:');
    console.error('1. Buka https://console.firebase.google.com/project/' + firebaseConfig.projectId + '/firestore');
    console.error('2. Klik "Create database" (Pilih mode: "Start in test mode" untuk development)');
    console.error('3. Setelah database aktif, jalankan kembali script ini.');
  }
  process.exit(1);
});
