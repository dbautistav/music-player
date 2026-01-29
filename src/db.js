class MusicPlayerDB {
  constructor(dbName = 'music-player-db', version = 1) {
    this.dbName = dbName;
    this.version = version;
    this.db = null;
  }

  async init() {
    try {
      return new Promise((resolve, reject) => {
        const request = indexedDB.open(this.dbName, this.version);

        request.onerror = () => {
          reject(new Error(`Failed to open database: ${request.error}`));
        };
        request.onsuccess = () => {
          this.db = request.result;
          resolve();
        };

        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          if (!db.objectStoreNames.contains('songs')) {
            const store = db.createObjectStore('songs', { keyPath: 'id' });
            store.createIndex('cachedAt', 'cachedAt', { unique: false });
            store.createIndex('fileSize', 'fileSize', { unique: false });
          }
        };
      });
    } catch (error) {
      throw new Error(`Database initialization failed: ${error.message}`);
    }
  }

  async saveSong(songData, audioBlob) {
    try {
      if (!audioBlob || audioBlob.size === 0) {
        throw new Error('Invalid audio blob');
      }

      const song = {
        ...songData,
        audioBlob,
        fileSize: audioBlob.size,
        cachedAt: Date.now(),
        cacheStatus: 'cached'
      };

      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction(['songs'], 'readwrite');
        const store = transaction.objectStore('songs');
        const request = store.put(song);

        request.onsuccess = () => resolve(song);
        request.onerror = () => {
          if (request.error.name === 'QuotaExceededError') {
            reject(new Error('Storage quota exceeded'));
          } else {
            reject(new Error(`Failed to save song: ${request.error}`));
          }
        };
      });
    } catch (error) {
      throw new Error(`Save song failed: ${error.message}`);
    }
  }

  async getSong(songId) {
    try {
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction(['songs'], 'readonly');
        const store = transaction.objectStore('songs');
        const request = store.get(songId);

        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => {
          reject(new Error(`Failed to get song: ${request.error}`));
        };
      });
    } catch (error) {
      throw new Error(`Get song failed: ${error.message}`);
    }
  }

  async deleteSong(songId) {
    try {
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction(['songs'], 'readwrite');
        const store = transaction.objectStore('songs');
        const request = store.delete(songId);

        request.onsuccess = () => resolve();
        request.onerror = () => {
          reject(new Error(`Failed to delete song: ${request.error}`));
        };
      });
    } catch (error) {
      throw new Error(`Delete song failed: ${error.message}`);
    }
  }

  async getAllSongs() {
    try {
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction(['songs'], 'readonly');
        const store = transaction.objectStore('songs');
        const index = store.index('cachedAt');
        const request = index.getAll();

        request.onsuccess = () => {
          const songs = request.result || [];
          const cachedSongs = songs.filter(s => s.cacheStatus === 'cached');
          resolve(cachedSongs.sort((a, b) => b.cachedAt - a.cachedAt));
        };
        request.onerror = () => {
          reject(new Error(`Failed to get all songs: ${request.error}`));
        };
      });
    } catch (error) {
      throw new Error(`Get all songs failed: ${error.message}`);
    }
  }

  async getStorageUsage() {
    try {
      const songs = await this.getAllSongs();
      return songs.reduce((total, song) => total + song.fileSize, 0);
    } catch (error) {
      throw new Error(`Get storage usage failed: ${error.message}`);
    }
  }

  async getLRUSongs(count = 5) {
    try {
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction(['songs'], 'readonly');
        const store = transaction.objectStore('songs');
        const index = store.index('cachedAt');
        const request = index.getAll();

        request.onsuccess = () => {
          const songs = request.result || [];
          const cachedSongs = songs.filter(s => s.cacheStatus === 'cached');
          const lruSongs = cachedSongs.sort((a, b) => a.cachedAt - b.cachedAt);
          resolve(lruSongs.slice(0, count));
        };
        request.onerror = () => {
          reject(new Error(`Failed to get LRU songs: ${request.error}`));
        };
      });
    } catch (error) {
      throw new Error(`Get LRU songs failed: ${error.message}`);
    }
  }

  async clearAll() {
    try {
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction(['songs'], 'readwrite');
        const store = transaction.objectStore('songs');
        const request = store.clear();

        request.onsuccess = () => resolve();
        request.onerror = () => {
          reject(new Error(`Failed to clear all: ${request.error}`));
        };
      });
    } catch (error) {
      throw new Error(`Clear all failed: ${error.message}`);
    }
  }
}
