let catalogData = null;
let songs = [];
let currentSongIndex = null;
let isPlaying = false;
let searchQuery = '';
let filteredSongs = [];
const audioElement = new Audio();
const db = new MusicPlayerDB();

let audioPlayer;
let searchInput;
let clearBtn;
let songList;
let loadingSkeleton;
let errorState;
let errorMessage;
let retryBtn;
let offlineIndicator;
let updateBanner;
let refreshBtn;

function formatDuration(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function showLoadingState() {
  if (loadingSkeleton) loadingSkeleton.hidden = false;
  if (songList) songList.hidden = true;
  if (errorState) errorState.hidden = true;
}

function hideLoadingState() {
  if (loadingSkeleton) loadingSkeleton.hidden = true;
  if (songList) songList.hidden = false;
  if (errorState) errorState.hidden = true;
}

function showErrorState(message) {
  if (loadingSkeleton) loadingSkeleton.hidden = true;
  if (songList) songList.hidden = true;
  if (errorState) errorState.hidden = false;
  if (errorMessage) errorMessage.textContent = message;
}

function showClearButton() {
  if (clearBtn) clearBtn.classList.add('visible');
}

function hideClearButton() {
  if (clearBtn) clearBtn.classList.remove('visible');
}

function filterSongs(query) {
  if (!catalogData) return;

  const lowerQuery = query.toLowerCase().trim();

  if (lowerQuery === '') {
    filteredSongs = songs;
    renderSongList();
    return;
  }

  filteredSongs = songs.filter(song => {
    const titleMatch = song.title.toLowerCase().includes(lowerQuery);
    const artistMatch = song.artist.toLowerCase().includes(lowerQuery);
    return titleMatch || artistMatch;
  });

  renderSongList();
}

async function loadCatalog() {
  try {
    console.log('[loadCatalog] Starting catalog load...');
    showLoadingState();

    console.log('[loadCatalog] Fetching catalog.json...');
    const response = await fetch('./catalog.json');
    console.log('[loadCatalog] Fetch response status:', response.status);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('[loadCatalog] Parsed JSON data:', data);

    if (!data.songs || !Array.isArray(data.songs)) {
      throw new Error('Invalid catalog format');
    }

    console.log('[loadCatalog] Loaded', data.songs.length, 'songs');
    catalogData = data;
    songs = data.songs;
    filteredSongs = songs;
    renderSongList();
    updateCacheIndicators();
    hideLoadingState();
    console.log('[loadCatalog] Catalog loaded successfully');

  } catch (error) {
    console.error('[loadCatalog] Error loading catalog:', error);
    if (!navigator.onLine) {
      showErrorState('You are offline. The app must be loaded online first.');
    } else {
      showErrorState('Unable to load song catalog. Please try again later.');
    }
  }
}

async function playSong(index) {
  currentSongIndex = index;
  const song = songs[index];

  try {
    const cached = await db.getSong(song.id);
    if (cached) {
      audioElement.src = URL.createObjectURL(cached.audioBlob);
      audioElement.play();
      isPlaying = true;
      updatePlayButtonIcons();
      updatePlayingState();
      return;
    }

    showLoadingState();

    const estimate = await navigator.storage.estimate();
    const currentUsage = await db.getStorageUsage();
    const blob = await (await fetch(song.url)).blob();

    if (estimate && estimate.quota) {
      const neededSpace = blob.size;
      const availableSpace = estimate.quota - estimate.usage;

      if (availableSpace < neededSpace) {
        const lruSongs = await db.getLRUSongs(10);

        for (const lruSong of lruSongs) {
          const lruBlob = lruSong.audioBlob;
          const newUsage = currentUsage - lruBlob.size;

          const newAvailable = estimate.quota - newUsage;

          if (newAvailable >= neededSpace) {
            await db.deleteSong(lruSong.id);
            currentUsage = newUsage;
            break;
          }
        }
      }
    }

    await db.saveSong(song, blob);

    audioElement.src = URL.createObjectURL(blob);
    audioElement.play();
    isPlaying = true;
    hideLoadingState();
    updatePlayButtonIcons();
    updatePlayingState();
    updateCacheIndicators();
    await updateStorageDisplay();

  } catch (error) {
    hideLoadingState();
    if (!navigator.onLine) {
      showErrorState('Song not cached. Must play online first.');
    } else if (error.message && error.message.includes('Storage quota')) {
      showErrorState('Storage full. Clear some cached songs to make space.');
    } else {
      showErrorState('Unable to play song. Please try again.');
    }
  }
}

function togglePlayPause() {
  if (isPlaying) {
    pauseSong();
  } else {
    resumeSong();
  }
}

function pauseSong() {
  audioElement.pause();
  isPlaying = false;
  updatePlayButtonIcons();
  updatePlayingState();
}

function resumeSong() {
  audioElement.play();
  isPlaying = true;
  updatePlayButtonIcons();
  updatePlayingState();
}

function nextSong() {
  if (songs.length === 0) return;
  const nextIndex = (currentSongIndex + 1) % songs.length;
  playSong(nextIndex);
}

function previousSong() {
  if (songs.length === 0) return;
  const prevIndex = (currentSongIndex - 1 + songs.length) % songs.length;
  playSong(prevIndex);
}

function createSongCard(song, songIndex) {
  const songCard = document.createElement('div');
  songCard.className = 'song-card';
  songCard.dataset.songId = song.id;
  songCard.setAttribute('role', 'listitem');
  songCard.setAttribute('tabindex', '0');

  if (songIndex === currentSongIndex && isPlaying) {
    songCard.classList.add('playing');
  } else if (songIndex === currentSongIndex && !isPlaying) {
    songCard.classList.add('playing');
    songCard.classList.add('paused');
  }

  const albumArt = song.albumArt
    ? (song.albumArt.includes('http') || song.albumArt.includes('./') || song.albumArt.includes('songs/'))
      ? `<img src="${song.albumArt}" alt="${song.title}" loading="lazy" class="album-art">`
      : `<div class="album-art-placeholder">${song.albumArt}</div>`
    : `<div class="album-art-placeholder">🎵</div>`;

  const duration = song.isAmbient ? '∞' : (song.duration ? formatDuration(song.duration) : '');

  songCard.innerHTML = `
    ${albumArt}
    <div class="song-info">
      <div class="song-title">${song.title}</div>
      <div class="song-artist">${song.artist}${duration ? ` • ${duration}` : ''}</div>
    </div>
    <div class="cache-indicator" data-song-id="${song.id}"></div>
  `;

  songCard.addEventListener('click', () => playSong(songIndex));

  songCard.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      playSong(songIndex);
    }
  });

  return songCard;
}

async function updateCacheIndicators() {
  const cachedSongs = await db.getAllSongs();
  const cachedIds = new Set(cachedSongs.map(s => s.id));

  document.querySelectorAll('.cache-indicator').forEach(indicator => {
    const songId = indicator.dataset.songId;
    if (cachedIds.has(songId)) {
      indicator.classList.add('cached');
      indicator.innerHTML = '⬇';
      indicator.setAttribute('title', 'Song is cached for offline playback');
    } else {
      indicator.classList.remove('cached');
      indicator.innerHTML = '';
    }
  });
}

function renderSongList() {
  const songsToRender = filteredSongs.length > 0 ? filteredSongs : songs;
  const container = songList;
  if (!container) return;
  container.innerHTML = '';

  if (songsToRender.length === 0) {
    container.innerHTML = `
      <div class="no-results">
        <p>No songs found</p>
      </div>
    `;
    return;
  }

  const fragment = document.createDocumentFragment();

  songsToRender.forEach((song) => {
    const songIndex = songs.findIndex(s => s.id === song.id);
    const songCard = createSongCard(song, songIndex);
    fragment.appendChild(songCard);
  });

  container.appendChild(fragment);
}

function updatePlayingState() {
  if (!songList) return;

  document.querySelectorAll('.song-card').forEach(card => {
    card.classList.remove('playing');
    card.classList.remove('paused');
  });

  if (currentSongIndex === null || !songs[currentSongIndex]) return;

  const currentSongId = songs[currentSongIndex].id;
  const currentCard = document.querySelector(`[data-song-id="${currentSongId}"]`);

  if (currentCard) {
    currentCard.classList.add('playing');
    if (!isPlaying) {
      currentCard.classList.add('paused');
    }
  }
}

function updatePlayButtonIcons() {
  const button = document.getElementById('play-pause-btn');
  if (!button) return;

  if (isPlaying) {
    button.textContent = 'Pause';
  } else {
    button.textContent = 'Play';
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  console.log('[App] DOM loaded, initializing...');

  if ('serviceWorker' in navigator) {
    try {
      console.log('[App] Registering Service Worker...');
      const registration = await navigator.serviceWorker.register('./sw.js');
      console.log('[App] Service Worker registered:', registration);

      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data === 'waiting') {
          console.log('[App] Service Worker update waiting, showing banner');
          showUpdateBanner();
        }
      });
    } catch (error) {
      console.error('[App] Service Worker registration failed:', error);
    }
  }

  audioPlayer = audioElement;
  searchInput = document.getElementById('search-input');
  clearBtn = document.getElementById('clear-search');
  songList = document.getElementById('song-list');
  loadingSkeleton = document.getElementById('loading-skeleton');
  errorState = document.getElementById('error-state');
  errorMessage = document.getElementById('error-message');
  retryBtn = document.getElementById('retry-btn');

  try {
    console.log('[App] Initializing IndexedDB...');
    await db.init();
    console.log('[App] IndexedDB initialized');
    await updateStorageDisplay();
  } catch (error) {
    console.error('[App] Failed to initialize offline storage:', error);
    showErrorState('Failed to initialize offline storage. Some features may not work.');
  }

  console.log('[App] Loading catalog...');
  loadCatalog();

  document.getElementById('play-pause-btn').addEventListener('click', togglePlayPause);
  document.getElementById('next-btn').addEventListener('click', nextSong);
  document.getElementById('prev-btn').addEventListener('click', previousSong);

  if (retryBtn) {
    retryBtn.addEventListener('click', loadCatalog);
  }

  if (searchInput) {
    const debouncedSearch = debounce((query) => {
      filterSongs(query);
    }, 300);

    searchInput.addEventListener('input', (e) => {
      const query = e.target.value;
      searchQuery = query;

      if (query.length > 0) {
        showClearButton();
      } else {
        hideClearButton();
      }

      debouncedSearch(query);
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (searchInput) {
        searchInput.value = '';
        searchQuery = '';
        hideClearButton();
        filterSongs('');
      }
    });
  }

  audioElement.addEventListener('error', (e) => {
    showErrorState('Failed to load audio file. Check if URL is accessible.');
  });

  audioElement.addEventListener('ended', () => {
    isPlaying = false;
    updatePlayButtonIcons();
    updatePlayingState();
  });

  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
  updateOnlineStatus();

  refreshBtn = document.getElementById('refresh-btn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      window.location.reload();
    });
  }

  const clearAllCacheBtn = document.getElementById('clear-all-cache');
  if (clearAllCacheBtn) {
    clearAllCacheBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to clear all cached songs? You will need to be online to play them again.')) {
        clearCache();
      }
    });
  }
});

function updateOnlineStatus() {
  offlineIndicator = document.getElementById('offline-indicator');
  if (offlineIndicator) {
    if (navigator.onLine) {
      offlineIndicator.hidden = true;
    } else {
      offlineIndicator.hidden = false;
    }
  }
}

function showUpdateBanner() {
  updateBanner = document.getElementById('update-banner');
  if (updateBanner) {
    updateBanner.hidden = false;
  }
}

async function updateStorageDisplay() {
  try {
    const storageUsage = await db.getStorageUsage();
    const estimate = await navigator.storage.estimate();

    const storageUsageElement = document.getElementById('storage-usage');
    const storageQuotaElement = document.getElementById('storage-quota');
    const storageUsedElement = document.getElementById('storage-used');
    const storageWarning = document.getElementById('storage-warning');

    const mb = (storageUsage / 1024 / 1024).toFixed(2);
    storageUsageElement.textContent = `${mb} MB`;

    if (estimate && estimate.quota) {
      const quotaMB = (estimate.quota / 1024 / 1024).toFixed(2);
      storageQuotaElement.textContent = `${quotaMB} MB`;

      const percentage = (storageUsage / estimate.quota * 100);
      storageUsedElement.style.width = `${percentage}%`;

      if (percentage > 80) {
        storageWarning.hidden = false;
      } else {
        storageWarning.hidden = true;
      }
    }
  } catch (error) {
  }
}

async function clearCache(songId = null) {
  try {
    showLoadingState();

    if (songId) {
      await db.deleteSong(songId);
    } else {
      await db.clearAll();
    }

    await updateStorageDisplay();
    await updateCacheIndicators();
    hideLoadingState();

    if (songId) {
      alert('Song cache cleared');
    } else {
      alert('All cached songs cleared');
    }
  } catch (error) {
    hideLoadingState();
    alert('Failed to clear cache. Please try again.');
  }
}

function showStorageWarning() {
  const storageWarning = document.getElementById('storage-warning');
  if (storageWarning) {
    storageWarning.hidden = false;
  }
}
