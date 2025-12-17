// Global variables
let currentUser = '';
let isPlaying = false;
let currentSong = '';

// DOM elements
const loginPage = document.getElementById('loginPage');
const mainApp = document.getElementById('mainApp');
const loginForm = document.getElementById('loginForm');
const logoutBtn = document.getElementById('logoutBtn');
const userDisplay = document.getElementById('userDisplay');
const profileName = document.getElementById('profileName');

// Navigation
const navBtns = document.querySelectorAll('.nav-btn');
const tabContents = document.querySelectorAll('.tab-content');

// Music player
const playPauseBtn = document.getElementById('playPauseBtn');
const currentSongDisplay = document.getElementById('currentSong');
const currentArtistDisplay = document.getElementById('currentArtist');

// Search
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const searchResults = document.getElementById('searchResults');

// Settings
const darkModeToggle = document.getElementById('darkMode');
const volumeSlider = document.getElementById('volumeSlider');

// Sample data
const songs = [
    { id: 'song1', title: 'Lagu Favorit 1', artist: 'Artist 1', album: 'Album 1', duration: '3:45' },
    { id: 'song2', title: 'Lagu Favorit 2', artist: 'Artist 2', album: 'Album 2', duration: '4:12' },
    { id: 'song3', title: 'Lagu Favorit 3', artist: 'Artist 3', album: 'Album 3', duration: '3:28' },
    { id: 'song4', title: 'Lagu Baru 1', artist: 'Artist 4', album: 'Album 4', duration: '3:55' },
    { id: 'song5', title: 'Lagu Baru 2', artist: 'Artist 5', album: 'Album 5', duration: '4:20' }
];

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Check if user is logged in
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = savedUser;
        showMainApp();
    }

    // Event listeners
    loginForm.addEventListener('submit', handleLogin);
    logoutBtn.addEventListener('click', handleLogout);
    
    // Navigation
    navBtns.forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    // Music player
    playPauseBtn.addEventListener('click', togglePlayPause);
    
    // Song selection
    document.querySelectorAll('.song-card, .song-item').forEach(item => {
        item.addEventListener('click', () => selectSong(item.dataset.song));
    });

    // Search
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
    });

    // Settings
    darkModeToggle.addEventListener('change', toggleDarkMode);
    volumeSlider.addEventListener('input', adjustVolume);

    // Load saved settings
    loadSettings();
}

function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Simple validation (in real app, use proper authentication)
    if (username && password) {
        currentUser = username;
        localStorage.setItem('currentUser', username);
        showMainApp();
    } else {
        alert('Masukkan username dan password!');
    }
}

function handleLogout() {
    currentUser = '';
    localStorage.removeItem('currentUser');
    showLoginPage();
}

function showMainApp() {
    loginPage.classList.remove('active');
    mainApp.classList.add('active');
    userDisplay.textContent = currentUser;
    profileName.textContent = currentUser;
}

function showLoginPage() {
    mainApp.classList.remove('active');
    loginPage.classList.add('active');
    document.getElementById('username').value = 'septian';
    document.getElementById('password').value = 'septian321';
}

function switchTab(tabName) {
    // Update navigation
    navBtns.forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    // Update content
    tabContents.forEach(content => content.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
}

function selectSong(songId) {
    const song = songs.find(s => s.id === songId);
    if (song) {
        currentSong = songId;
        currentSongDisplay.textContent = song.title;
        currentArtistDisplay.textContent = song.artist;
        
        // Update play button
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        isPlaying = true;
        
        console.log(`Playing: ${song.title} by ${song.artist}`);
    }
}

function togglePlayPause() {
    if (isPlaying) {
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        isPlaying = false;
        console.log('Music paused');
    } else {
        if (currentSong) {
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            isPlaying = true;
            console.log('Music playing');
        } else {
            alert('Pilih lagu terlebih dahulu!');
        }
    }
}

function performSearch() {
    const query = searchInput.value.toLowerCase().trim();
    
    if (!query) {
        searchResults.innerHTML = '<p>Masukkan kata kunci untuk mencari musik</p>';
        return;
    }

    const results = songs.filter(song => 
        song.title.toLowerCase().includes(query) ||
        song.artist.toLowerCase().includes(query) ||
        song.album.toLowerCase().includes(query)
    );

    if (results.length > 0) {
        let html = '<h3>Hasil Pencarian:</h3>';
        results.forEach(song => {
            html += `
                <div class="song-item" data-song="${song.id}">
                    <i class="fas fa-music"></i>
                    <div class="song-info">
                        <h4>${song.title}</h4>
                        <p>${song.artist} - ${song.album}</p>
                    </div>
                    <span class="duration">${song.duration}</span>
                </div>
            `;
        });
        searchResults.innerHTML = html;

        // Add click listeners to search results
        searchResults.querySelectorAll('.song-item').forEach(item => {
            item.addEventListener('click', () => selectSong(item.dataset.song));
        });
    } else {
        searchResults.innerHTML = '<p>Tidak ada hasil yang ditemukan</p>';
    }
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', darkModeToggle.checked);
}

function adjustVolume() {
    const volume = volumeSlider.value;
    console.log(`Volume set to: ${volume}%`);
    // In real app, this would control actual audio volume
}

function loadSettings() {
    // Load dark mode setting
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === 'true') {
        darkModeToggle.checked = true;
        document.body.classList.add('dark-mode');
    }

    // Load volume setting
    const savedVolume = localStorage.getItem('volume');
    if (savedVolume) {
        volumeSlider.value = savedVolume;
    }
}

// Save settings when changed
volumeSlider.addEventListener('change', () => {
    localStorage.setItem('volume', volumeSlider.value);
});

// Music control buttons
document.getElementById('playBtn')?.addEventListener('click', () => {
    if (currentSong) {
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        isPlaying = true;
        console.log('Music playing');
    }
});

document.getElementById('pauseBtn')?.addEventListener('click', () => {
    playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    isPlaying = false;
    console.log('Music paused');
});

document.getElementById('stopBtn')?.addEventListener('click', () => {
    playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    isPlaying = false;
    currentSong = '';
    currentSongDisplay.textContent = 'Pilih Lagu';
    currentArtistDisplay.textContent = '-';
    console.log('Music stopped');
});

document.getElementById('prevBtn')?.addEventListener('click', () => {
    console.log('Previous song');
});

document.getElementById('nextBtn')?.addEventListener('click', () => {
    console.log('Next song');
});
