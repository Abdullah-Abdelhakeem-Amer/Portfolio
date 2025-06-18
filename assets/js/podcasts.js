// ==========================================================================
// Podcasts JavaScript - Episode Management and Audio Player
// ==========================================================================

class PodcastManager {
    constructor() {
        this.episodes = [];
        this.currentEpisode = null;
        this.audioPlayer = null;
        this.isPlaying = false;
        
        this.init();
    }

    async init() {
        await this.loadEpisodesData();
        this.setupAudioPlayer();
        this.setupEventListeners();
        this.renderEpisodes();
    }

    async loadEpisodesData() {
        try {
            // Try to load from episodes.json if it exists
            const response = await fetch('../data/episodes.json');
            if (response.ok) {
                const data = await response.json();
                this.episodes = data.episodes || [];
            } else {
                throw new Error('Episodes data not found');
            }
        } catch (error) {
            console.log('Loading fallback episodes data');
            this.loadFallbackEpisodes();
        }
    }

    loadFallbackEpisodes() {
        this.episodes = [
            {
                id: 'ep-15',
                number: 15,
                title: 'AOSP Automotive Deep Dive: Building Custom Vehicle Interfaces',
                description: 'In this comprehensive episode, we explore the intricacies of Android Automotive OS (AAOS) development. From custom HAL implementations to vehicle property management, we cover everything you need to know about building production-ready automotive interfaces.',
                date: '2024-03-15',
                duration: '45:23',
                category: 'automotive',
                topics: ['AOSP', 'Android Automotive', 'Vehicle HAL', 'Custom UI'],
                audioUrl: '../assets/audio/episodes/ep-15.mp3',
                spotifyUrl: 'https://open.spotify.com/episode/ep-15',
                appleUrl: 'https://podcasts.apple.com/episode/ep-15',
                featured: true
            },
            {
                id: 'ep-14',
                number: 14,
                title: 'Embedded Linux Optimization for Automotive Systems',
                description: 'Deep dive into embedded Linux optimization techniques specifically for automotive applications. We discuss kernel tuning, real-time patches, and performance optimization strategies.',
                date: '2024-03-01',
                duration: '38:45',
                category: 'embedded',
                topics: ['Embedded Linux', 'Kernel Optimization', 'Real-time Systems', 'Performance'],
                audioUrl: '../assets/audio/episodes/ep-14.mp3',
                spotifyUrl: 'https://open.spotify.com/episode/ep-14',
                appleUrl: 'https://podcasts.apple.com/episode/ep-14'
            },
            {
                id: 'ep-13',
                number: 13,
                title: 'CAN Bus Security: Protecting Connected Vehicles',
                description: 'Exploring automotive cybersecurity with focus on CAN bus vulnerabilities and protection mechanisms. Learn about intrusion detection systems and secure communication protocols.',
                date: '2024-02-15',
                duration: '42:18',
                category: 'automotive',
                topics: ['CAN Bus', 'Cybersecurity', 'Vehicle Security', 'Intrusion Detection'],
                audioUrl: '../assets/audio/episodes/ep-13.mp3',
                spotifyUrl: 'https://open.spotify.com/episode/ep-13',
                appleUrl: 'https://podcasts.apple.com/episode/ep-13'
            },
            {
                id: 'ep-12',
                number: 12,
                title: 'Interview: Tesla Software Engineer on Autopilot Development',
                description: 'Exclusive interview with a Tesla software engineer discussing the challenges and innovations in autonomous driving software development.',
                date: '2024-02-01',
                duration: '52:30',
                category: 'interviews',
                topics: ['Tesla', 'Autopilot', 'Autonomous Driving', 'Machine Learning'],
                audioUrl: '../assets/audio/episodes/ep-12.mp3',
                spotifyUrl: 'https://open.spotify.com/episode/ep-12',
                appleUrl: 'https://podcasts.apple.com/episode/ep-12'
            }
        ];
    }

    setupAudioPlayer() {
        this.audioPlayer = document.getElementById('audio-element');
        const playPauseBtn = document.getElementById('play-pause-btn');
        const progressBar = document.getElementById('progress-bar');
        const progressFill = document.getElementById('progress-fill');
        const timeDisplay = document.getElementById('time-display');
        const volumeBtn = document.getElementById('volume-btn');
        const closePlayerBtn = document.getElementById('close-player');

        if (!this.audioPlayer) return;

        // Play/Pause button
        playPauseBtn?.addEventListener('click', () => {
            if (this.isPlaying) {
                this.pauseEpisode();
            } else {
                this.resumeEpisode();
            }
        });

        // Progress bar click
        progressBar?.addEventListener('click', (e) => {
            const rect = progressBar.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const width = rect.width;
            const percentage = clickX / width;
            
            if (this.audioPlayer.duration) {
                this.audioPlayer.currentTime = percentage * this.audioPlayer.duration;
            }
        });

        // Audio player events
        this.audioPlayer.addEventListener('timeupdate', () => {
            this.updateProgress();
        });

        this.audioPlayer.addEventListener('ended', () => {
            this.stopEpisode();
        });

        // Volume control
        volumeBtn?.addEventListener('click', () => {
            if (this.audioPlayer.muted) {
                this.audioPlayer.muted = false;
                volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
            } else {
                this.audioPlayer.muted = true;
                volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
            }
        });

        // Close player
        closePlayerBtn?.addEventListener('click', () => {
            this.stopEpisode();
        });
    }

    setupEventListeners() {
        // Episode filter buttons
        const filterButtons = document.querySelectorAll('.episodes-filter .filter-btn');
        filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.handleFilterChange(e.target);
            });
        });

        // Load more episodes button
        const loadMoreBtn = document.getElementById('load-more-episodes');
        loadMoreBtn?.addEventListener('click', () => {
            this.loadMoreEpisodes();
        });

        // Newsletter form
        const newsletterForm = document.getElementById('newsletter-form');
        newsletterForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleNewsletterSignup(e.target);
        });
    }

    handleFilterChange(button) {
        // Update active button
        document.querySelectorAll('.episodes-filter .filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        button.classList.add('active');

        // Filter episodes
        const filter = button.getAttribute('data-filter');
        this.filterEpisodes(filter);
    }

    filterEpisodes(filter) {
        let filteredEpisodes = this.episodes;
        
        if (filter !== 'all') {
            filteredEpisodes = this.episodes.filter(episode => 
                episode.category === filter
            );
        }
        
        this.renderEpisodes(filteredEpisodes);
    }

    renderEpisodes(episodesToRender = this.episodes) {
        const episodesGrid = document.getElementById('episodes-grid');
        if (!episodesGrid) return;

        if (episodesToRender.length === 0) {
            episodesGrid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-podcast"></i>
                    <h3>No episodes found</h3>
                    <p>Try adjusting your filter selection.</p>
                </div>
            `;
            return;
        }

        const episodesHTML = episodesToRender.map(episode => 
            this.createEpisodeCard(episode)
        ).join('');

        episodesGrid.innerHTML = episodesHTML;
    }

    createEpisodeCard(episode) {
        const topicTags = episode.topics.map(topic => 
            `<span class="topic-tag">${topic}</span>`
        ).join('');

        return `
            <div class="episode-card" data-episode-id="${episode.id}">
                <div class="episode-artwork">
                    <img src="https://images.unsplash.com/photo-1590736969955-71cc94901144?w=300&h=300&fit=crop&crop=center" 
                         alt="Episode ${episode.number} - ${episode.title}">
                    <button class="play-button" onclick="podcastManager.playEpisode('${episode.id}')">
                        <i class="fas fa-play"></i>
                    </button>
                </div>
                <div class="episode-content">
                    <div class="episode-meta">
                        <span class="episode-number">Episode #${episode.number}</span>
                        <span class="episode-date">${this.formatDate(episode.date)}</span>
                        <span class="episode-duration">${episode.duration}</span>
                    </div>
                    <h3 class="episode-title">${episode.title}</h3>
                    <p class="episode-description">${episode.description}</p>
                    <div class="episode-topics">
                        ${topicTags}
                    </div>
                    <div class="episode-actions">
                        <button class="btn btn-primary" onclick="podcastManager.playEpisode('${episode.id}')">
                            <i class="fas fa-play"></i>
                            Play Episode
                        </button>
                        <a href="${episode.spotifyUrl}" target="_blank" class="btn btn-outline">
                            <i class="fab fa-spotify"></i>
                            Spotify
                        </a>
                    </div>
                </div>
            </div>
        `;
    }

    playEpisode(episodeId) {
        const episode = this.episodes.find(ep => ep.id === episodeId);
        if (!episode) return;

        this.currentEpisode = episode;
        
        // Show audio player
        const audioPlayerContainer = document.getElementById('audio-player');
        if (audioPlayerContainer) {
            audioPlayerContainer.style.display = 'block';
        }

        // Load and play audio (simulated)
        if (this.audioPlayer) {
            // In a real implementation, you would load the actual audio file
            // this.audioPlayer.src = episode.audioUrl;
            // this.audioPlayer.play();
            
            // For demo purposes, we'll simulate playback
            this.simulatePlayback(episode);
        }

        this.isPlaying = true;
        this.updatePlayButton();
    }

    simulatePlayback(episode) {
        // Simulate audio playback for demo
        const playPauseBtn = document.getElementById('play-pause-btn');
        const timeDisplay = document.getElementById('time-display');
        
        if (playPauseBtn) {
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        }
        
        if (timeDisplay) {
            timeDisplay.textContent = `0:00 / ${episode.duration}`;
        }
        
        // Show notification
        this.showNotification(`Now playing: ${episode.title}`, 'success');
    }

    pauseEpisode() {
        if (this.audioPlayer) {
            this.audioPlayer.pause();
        }
        this.isPlaying = false;
        this.updatePlayButton();
    }

    resumeEpisode() {
        if (this.audioPlayer) {
            this.audioPlayer.play();
        }
        this.isPlaying = true;
        this.updatePlayButton();
    }

    stopEpisode() {
        if (this.audioPlayer) {
            this.audioPlayer.pause();
            this.audioPlayer.currentTime = 0;
        }
        
        const audioPlayerContainer = document.getElementById('audio-player');
        if (audioPlayerContainer) {
            audioPlayerContainer.style.display = 'none';
        }
        
        this.isPlaying = false;
        this.currentEpisode = null;
        this.updatePlayButton();
    }

    updatePlayButton() {
        const playPauseBtn = document.getElementById('play-pause-btn');
        if (playPauseBtn) {
            if (this.isPlaying) {
                playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            } else {
                playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            }
        }
    }

    updateProgress() {
        if (!this.audioPlayer) return;
        
        const progressFill = document.getElementById('progress-fill');
        const timeDisplay = document.getElementById('time-display');
        
        const currentTime = this.audioPlayer.currentTime;
        const duration = this.audioPlayer.duration;
        
        if (duration) {
            const percentage = (currentTime / duration) * 100;
            if (progressFill) {
                progressFill.style.width = percentage + '%';
            }
            
            if (timeDisplay) {
                const currentFormatted = this.formatTime(currentTime);
                const durationFormatted = this.formatTime(duration);
                timeDisplay.textContent = `${currentFormatted} / ${durationFormatted}`;
            }
        }
    }

    loadMoreEpisodes() {
        // Simulate loading more episodes
        this.showNotification('All episodes loaded!', 'info');
    }

    handleNewsletterSignup(form) {
        const email = form.querySelector('#newsletter-email').value;
        
        // Simulate newsletter signup
        this.showNotification('Thank you for subscribing! You\'ll receive notifications about new episodes.', 'success');
        form.reset();
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'exclamation' : 'info'}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }
}

// Global function for episode playback (called from HTML)
function playEpisode(episodeId) {
    if (window.podcastManager) {
        window.podcastManager.playEpisode(episodeId);
    }
}

// Initialize podcast manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.podcasts-hero') || document.getElementById('episodes-grid')) {
        window.podcastManager = new PodcastManager();
    }
});

// Add CSS for notifications
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        padding: 16px;
        display: flex;
        align-items: center;
        gap: 12px;
        z-index: 1000;
        min-width: 300px;
        animation: slideIn 0.3s ease-out;
    }
    
    .notification-success {
        border-left: 4px solid #10b981;
    }
    
    .notification-error {
        border-left: 4px solid #ef4444;
    }
    
    .notification-info {
        border-left: 4px solid #3b82f6;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 8px;
        flex: 1;
    }
    
    .notification-close {
        background: none;
        border: none;
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        opacity: 0.7;
    }
    
    .notification-close:hover {
        opacity: 1;
        background: rgba(0,0,0,0.1);
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style); 