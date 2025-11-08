// Offline functionality and IndexedDB storage

const DB_NAME = "DocTalkOfflineDB";
const DB_VERSION = 1;

export interface OfflineConsultation {
  id: string;
  notes: string;
  timestamp: number;
  synced: boolean;
}

/**
 * Initialize IndexedDB
 */
const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Create object stores
      if (!db.objectStoreNames.contains("consultationNotes")) {
        const notesStore = db.createObjectStore("consultationNotes", {
          keyPath: "id",
        });
        notesStore.createIndex("synced", "synced", { unique: false });
        notesStore.createIndex("timestamp", "timestamp", { unique: false });
      }

      if (!db.objectStoreNames.contains("offlineMessages")) {
        const messagesStore = db.createObjectStore("offlineMessages", {
          keyPath: "id",
          autoIncrement: true,
        });
        messagesStore.createIndex("consultationId", "consultationId", {
          unique: false,
        });
        messagesStore.createIndex("synced", "synced", { unique: false });
      }
    };
  });
};

/**
 * Save consultation notes offline
 */
export const saveConsultationNoteOffline = async (
  consultationId: string,
  notes: string
): Promise<void> => {
  const db = await initDB();
  const transaction = db.transaction(["consultationNotes"], "readwrite");
  const store = transaction.objectStore("consultationNotes");

  const data: OfflineConsultation = {
    id: consultationId,
    notes,
    timestamp: Date.now(),
    synced: false,
  };

  return new Promise((resolve, reject) => {
    const request = store.put(data);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

/**
 * Get unsynced consultation notes
 */
export const getUnsyncedNotes = async (): Promise<OfflineConsultation[]> => {
  const db = await initDB();
  const transaction = db.transaction(["consultationNotes"], "readonly");
  const store = transaction.objectStore("consultationNotes");
  const index = store.index("synced");

  return new Promise((resolve, reject) => {
    const request = index.getAll(IDBKeyRange.only(false));
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

/**
 * Mark consultation note as synced
 */
export const markNoteSynced = async (consultationId: string): Promise<void> => {
  const db = await initDB();
  const transaction = db.transaction(["consultationNotes"], "readwrite");
  const store = transaction.objectStore("consultationNotes");

  return new Promise((resolve, reject) => {
    const getRequest = store.get(consultationId);
    getRequest.onsuccess = () => {
      const data = getRequest.result;
      if (data) {
        data.synced = true;
        const putRequest = store.put(data);
        putRequest.onsuccess = () => resolve();
        putRequest.onerror = () => reject(putRequest.error);
      } else {
        resolve();
      }
    };
    getRequest.onerror = () => reject(getRequest.error);
  });
};

/**
 * Save message offline
 */
export const saveMessageOffline = async (
  consultationId: string,
  content: string,
  senderId: string
): Promise<void> => {
  const db = await initDB();
  const transaction = db.transaction(["offlineMessages"], "readwrite");
  const store = transaction.objectStore("offlineMessages");

  const data = {
    consultationId,
    content,
    senderId,
    timestamp: Date.now(),
    synced: false,
  };

  return new Promise((resolve, reject) => {
    const request = store.add(data);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

/**
 * Check if online
 */
export const isOnline = (): boolean => {
  return navigator.onLine;
};

/**
 * Listen for online/offline events
 */
export const setupConnectivityListeners = (
  onOnline: () => void,
  onOffline: () => void
): (() => void) => {
  window.addEventListener("online", onOnline);
  window.addEventListener("offline", onOffline);

  return () => {
    window.removeEventListener("online", onOnline);
    window.removeEventListener("offline", onOffline);
  };
};
