const songs = [
  {
    id: 1,
    title: 'Acoustic Breeze',
    artist: 'Benjamin Tissot',
    url: 'https://www.bensound.com/bensound-music/bensound-acousticbreeze.mp3',
    duration: 157
  },
  {
    id: 2,
    title: 'Sunny',
    artist: 'Benjamin Tissot',
    url: 'https://www.bensound.com/bensound-music/bensound-sunny.mp3',
    duration: 142
  },
  {
    id: 3,
    title: 'Ukulele',
    artist: 'Benjamin Tissot',
    url: 'https://www.bensound.com/bensound-music/bensound-ukulele.mp3',
    duration: 146
  }
];

let currentSongIndex = 0;
let isPlaying = false;
const audioElement = new Audio();

function formatDuration(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function showErrorState(message) {
  const container = document.getElementById('song-list');
  container.innerHTML = `
    <div style="padding: 2rem; text-align: center; color: #d32f2f;">
      <p style="font-size: 1.25rem; margin-bottom: 1rem;">⚠️ Error</p>
      <p>${message}</p>
      <button onclick="location.reload()" style="margin-top: 1rem;">Retry</button>
    </div>
  `;
}

function playSong(index) {
  currentSongIndex = index;
  const song = songs[index];

  try {
    audioElement.src = song.url;
    audioElement.play();
    isPlaying = true;
    updatePlayButton();
    renderSongList();
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
  updatePlayButton();
  renderSongList();
}

function resumeSong() {
  audioElement.play();
  isPlaying = true;
  updatePlayButton();
  renderSongList();
}

function updatePlayButton() {
  const button = document.getElementById('play-pause-btn');
  if (isPlaying) {
    button.textContent = 'Pause';
  } else {
    button.textContent = 'Play';
  }
}

function nextSong() {
  const nextIndex = (currentSongIndex + 1) % songs.length;
  playSong(nextIndex);
}

function previousSong() {
  const prevIndex = (currentSongIndex - 1 + songs.length) % songs.length;
  playSong(prevIndex);
}

function renderSongList() {
  const container = document.getElementById('song-list');
  container.innerHTML = '';

  songs.forEach((song, index) => {
    const songCard = document.createElement('div');
    songCard.className = 'song-card';
    songCard.dataset.songId = song.id;

    if (index === currentSongIndex && isPlaying) {
      songCard.classList.add('playing');
    }

    const duration = song.duration ? formatDuration(song.duration) : '';

    songCard.innerHTML = `
      <div class="song-info">
        <div class="song-title">${song.title}</div>
        <div class="song-artist">${song.artist}${duration ? ` • ${duration}` : ''}</div>
      </div>
    `;

    songCard.addEventListener('click', () => playSong(index));
    container.appendChild(songCard);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderSongList();
  updatePlayButton();

  document.getElementById('play-pause-btn').addEventListener('click', togglePlayPause);
  document.getElementById('next-btn').addEventListener('click', nextSong);
  document.getElementById('prev-btn').addEventListener('click', previousSong);

  audioElement.addEventListener('error', (e) => {
    console.error('Audio error:', e);
    showErrorState('Failed to load audio file. Check if URL is accessible.');
  });

  audioElement.addEventListener('ended', () => {
    isPlaying = false;
    updatePlayButton();
    renderSongList();
  });
});
