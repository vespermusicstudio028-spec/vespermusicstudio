const DB_NAME = "VesperMusicDB";
const STORE_NAME = "customAudios";
const DB_VERSION = 1;

export interface StoredAudio {
  trackId: string;
  name: string;
  blob: Blob;
}

export function initDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "trackId" });
      }
    };
  });
}

export async function saveAudio(trackId: string, name: string, blob: Blob): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put({ trackId, name, blob });

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

export async function getAudio(trackId: string): Promise<{ name: string; blob: Blob } | null> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(trackId);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      if (request.result) {
        resolve({ name: request.result.name, blob: request.result.blob });
      } else {
        resolve(null);
      }
    };
  });
}

export async function getAllAudios(): Promise<StoredAudio[]> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result || []);
  });
}

export async function deleteAudio(trackId: string): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(trackId);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}
