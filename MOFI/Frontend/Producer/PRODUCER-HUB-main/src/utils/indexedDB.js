// IndexedDB utility for storing large files like videos
const DB_NAME = 'ProducerHubDB';
const DB_VERSION = 1;
const STORE_NAME = 'trailers';

// Open or create database
const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
};

// Save trailer video to IndexedDB
export const saveTrailerVideo = async (trailerId, videoBlob, videoFileName) => {
  try {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    const data = {
      id: trailerId,
      videoBlob: videoBlob,
      videoFileName: videoFileName,
      timestamp: Date.now()
    };

    return new Promise((resolve, reject) => {
      const request = store.put(data);
      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error saving video to IndexedDB:', error);
    throw error;
  }
};

// Get trailer video from IndexedDB
export const getTrailerVideo = async (trailerId) => {
  try {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);

    return new Promise((resolve, reject) => {
      const request = store.get(trailerId);
      request.onsuccess = () => {
        if (request.result && request.result.videoBlob) {
          // Create a URL from the stored Blob
          const videoURL = URL.createObjectURL(request.result.videoBlob);
          resolve({
            videoURL,
            videoFileName: request.result.videoFileName
          });
        } else {
          resolve(null);
        }
      };
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error getting video from IndexedDB:', error);
    return null;
  }
};

// Delete trailer video from IndexedDB
export const deleteTrailerVideo = async (trailerId) => {
  try {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    return new Promise((resolve, reject) => {
      const request = store.delete(trailerId);
      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error deleting video from IndexedDB:', error);
    throw error;
  }
};

// Get all trailer IDs from IndexedDB
export const getAllTrailerIds = async () => {
  try {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);

    return new Promise((resolve, reject) => {
      const request = store.getAllKeys();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error getting trailer IDs from IndexedDB:', error);
    return [];
  }
};

// Get database storage estimate
export const getStorageEstimate = async () => {
  if ('storage' in navigator && 'estimate' in navigator.storage) {
    const estimate = await navigator.storage.estimate();
    return {
      usage: estimate.usage,
      quota: estimate.quota,
      usageInMB: (estimate.usage / (1024 * 1024)).toFixed(2),
      quotaInMB: (estimate.quota / (1024 * 1024)).toFixed(2),
      percentUsed: ((estimate.usage / estimate.quota) * 100).toFixed(1)
    };
  }
  return null;
};
