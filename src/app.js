let catalogData = null;
let songs = [];
let currentSongIndex = null;
let isPlaying = false;
let searchQuery = '';
let filteredSongs = [];
const audioElement = new Audio();

let audioPlayer;
let searchInput;
let clearBtn;
let songList;
let loadingSkeleton;
let errorState;
let errorMessage;
let retryBtn;

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
    showLoadingState();

    const response = await fetch('./catalog.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.songs || !Array.isArray(data.songs)) {
      throw new Error('Invalid catalog format');
    }

    catalogData = data;
    songs = data.songs;
    filteredSongs = songs;
    renderSongList();
    hideLoadingState();

  } catch (error) {
    console.error('Failed to load catalog:', error);
    showErrorState('Unable to load song catalog. Please try again later.');
  }
}

function playSong(index) {
  currentSongIndex = index;
  const song = songs[index];

  try {
    audioElement.src = song.url;
    audioElement.play();
    isPlaying = true;
    updatePlayButtonIcons();
    updatePlayingState();
  } catch (error) {
    console.error('Failed to play song:', error);
    showErrorState('Unable to play song. Please try again.');
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
    ? `<img src="${song.albumArt}" alt="${song.title}" loading="lazy" class="album-art">`
    : `<div class="album-art-placeholder">🎵</div>`;

  const duration = song.duration ? formatDuration(song.duration) : '';

  songCard.innerHTML = `
    ${albumArt}
    <div class="song-info">
      <div class="song-title">${song.title}</div>
      <div class="song-artist">${song.artist}${duration ? ` • ${duration}` : ''}</div>
    </div>
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

document.addEventListener('DOMContentLoaded', () => {
  audioPlayer = audioElement;
  searchInput = document.getElementById('search-input');
  clearBtn = document.getElementById('clear-search');
  songList = document.getElementById('song-list');
  loadingSkeleton = document.getElementById('loading-skeleton');
  errorState = document.getElementById('error-state');
  errorMessage = document.getElementById('error-message');
  retryBtn = document.getElementById('retry-btn');

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
    console.error('Audio error:', e);
    showErrorState('Failed to load audio file. Check if URL is accessible.');
  });

  audioElement.addEventListener('ended', () => {
    isPlaying = false;
    updatePlayButtonIcons();
    updatePlayingState();
  });
});
