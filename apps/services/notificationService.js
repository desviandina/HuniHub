import AsyncStorage from '@react-native-async-storage/async-storage';

export const NOTIFICATIONS_KEY = 'hunihub_notifications';

const defaultNotifications = [
  {
    id: 'n1',
    title: 'Selamat datang di HuniHub',
    body: 'Kelola akun, cari hunian, dan ajukan sewa dengan mudah.',
    read: false,
    createdAt: new Date().toISOString(),
  },
];

async function getAll() {
  const raw = await AsyncStorage.getItem(NOTIFICATIONS_KEY);
  return raw ? JSON.parse(raw) : defaultNotifications;
}

export async function listNotifications(user) {
  const items = await getAll();
  return items.filter((item) => !item.userId || item.userId === user.uid);
}

export async function markAsRead(id) {
  const items = await getAll();
  const updated = items.map((item) => (item.id === id ? { ...item, read: true } : item));
  await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
}

export async function pushNotification(notification) {
  const items = await getAll();
  items.unshift({ ...notification, id: 'n' + Date.now() });
  await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(items));
}