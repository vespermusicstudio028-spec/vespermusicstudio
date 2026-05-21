import { Track } from "../types";

const DB_NAME = "VesperMusicDB";
const STORE_NAME = "customAudios";
const CUSTOM_STORE_NAME = "cardCustomizations";
const TRACKS_STORE_NAME = "portfolioTracks";
const DB_VERSION = 3;

export interface StoredAudio {
  trackId: string;
  name: string;
  blob: Blob;
}

export interface CardCustomization {
  trackId: string;
  title: string;
  titleColor: string;
  category: string;
  categoryColor: string;
  bpm: string;
  bpmColor: string;
  notes: string;
  description: string;
  tags: string;
  waveColor: string;
}

export function initDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "trackId" });
      }
      if (!db.objectStoreNames.contains(CUSTOM_STORE_NAME)) {
        db.createObjectStore(CUSTOM_STORE_NAME, { keyPath: "trackId" });
      }
      if (!db.objectStoreNames.contains(TRACKS_STORE_NAME)) {
        db.createObjectStore(TRACKS_STORE_NAME, { keyPath: "id" });
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

// === CARD CUSTOMIZATION FUNCTIONS ===

export async function saveCardCustomization(customization: CardCustomization): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(CUSTOM_STORE_NAME, "readwrite");
    const store = transaction.objectStore(CUSTOM_STORE_NAME);
    const request = store.put(customization);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

export async function getAllCardCustomizations(): Promise<CardCustomization[]> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(CUSTOM_STORE_NAME, "readonly");
    const store = transaction.objectStore(CUSTOM_STORE_NAME);
    const request = store.getAll();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result || []);
  });
}

// === DYNAMIC TRACK FUNCTIONS ===

export async function saveTrack(track: Track): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(TRACKS_STORE_NAME, "readwrite");
    const store = transaction.objectStore(TRACKS_STORE_NAME);
    const request = store.put(track);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

export async function getAllTracks(): Promise<Track[]> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(TRACKS_STORE_NAME, "readonly");
    const store = transaction.objectStore(TRACKS_STORE_NAME);
    const request = store.getAll();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result || []);
  });
}

export async function deleteTrack(trackId: string): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(TRACKS_STORE_NAME, "readwrite");
    const store = transaction.objectStore(TRACKS_STORE_NAME);
    const request = store.delete(trackId);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

