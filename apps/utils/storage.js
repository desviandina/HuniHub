import AsyncStorageRaw from '@react-native-async-storage/async-storage';

// In Node.js environments (test runners / scripts), polyfill window.localStorage
// so AsyncStorage web fallback operates seamlessly without ReferenceError.
if (typeof window === 'undefined') {
  const memoryStore = new Map();
  global.window = {
    localStorage: {
      getItem: (key) => (memoryStore.has(key) ? memoryStore.get(key) : null),
      setItem: (key, val) => memoryStore.set(key, String(val)),
      removeItem: (key) => memoryStore.delete(key),
      clear: () => memoryStore.clear(),
    },
  };
}

const AsyncStorage =
  AsyncStorageRaw.default?.default || AsyncStorageRaw.default || AsyncStorageRaw;

export default AsyncStorage;
