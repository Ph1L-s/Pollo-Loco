/**
 * @class SoundManager
 * @summary comprehensive audio management system for El Pollo Loco game
 * @description manages background music, sound effects, volume controls and audio state persistence
 */
class SoundManager {
    /**
     * @summary initializes audio system with all game sounds and default settings
     * @description loads music and SFX files, sets up volume controls with localStorage persistence
     */
    constructor() {
        this.isMuted = false;
        this.masterVolume = 0.20;
        this.musicVolume = 0.20;
        this.sfxVolume = 0.20;
        
        this.loadSettings();
        this.initializeAudio();
    }

    /**
     * @summary initializes all audio objects
     * @description creates Audio objects for background music and sound effects
     */
    initializeAudio() {
        this.BACKGROUND_MUSIC = new Audio('assets/audio/music/main.mp3');
        this.BACKGROUND_MUSIC.loop = true;
        this.BACKGROUND_MUSIC.volume = this.musicVolume;

        this.SFX = {
            COIN_COLLECT: new Audio('assets/audio/sfx/Coin.mp3'),
            BOSS_HIT: new Audio('assets/audio/sfx/boss_chicken_hit.mp3'),
            BOTTLE_GRAB: new Audio('assets/audio/sfx/bottle_grab.mp3'),
            ENEMY_DIE: new Audio('assets/audio/sfx/enemy_chicken_dies.mp3'),
            GAME_OVER: new Audio('assets/audio/sfx/game_over.mp3'),
            GAME_WON: new Audio('assets/audio/sfx/game_won.mp3'),
            BOSS_DIE: new Audio('assets/audio/sfx/kill_chicken_boss.wav'),
            PLAYER_DIE: new Audio('assets/audio/sfx/player_die.wav'),
            PLAYER_HURT: new Audio('assets/audio/sfx/player_hurt.wav'),
            PLAYER_JUMP: new Audio('assets/audio/sfx/player_jump.mp3'),
            PLAYER_IDLE: new Audio('assets/audio/sfx/player_sleepin_idl_long.mp3'),
            PLAYER_STEP: new Audio('assets/audio/sfx/step.mp3')
        };

        this.applySFXVolume();
    }


    /**
     * @summary loads audio settings from localStorage
     * @description retrieves saved volume and mute settings with fallback to defaults
     */
    loadSettings() {
        const savedSettings = localStorage.getItem('polloLocoAudio');
        if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            this.isMuted = settings.isMuted || false;
            this.masterVolume = settings.masterVolume || 0.20;
            this.musicVolume = settings.musicVolume || 0.20;
            this.sfxVolume = settings.sfxVolume || 0.20;
        }
    }

    /**
     * @summary saves current audio settings to localStorage
     * @description persists volume and mute settings for next game session
     */
    saveSettings() {
        const settings = {
            isMuted: this.isMuted,
            masterVolume: this.masterVolume,
            musicVolume: this.musicVolume,
            sfxVolume: this.sfxVolume
        };
        localStorage.setItem('polloLocoAudio', JSON.stringify(settings));
    }

    /**
     * @summary starts background music playback
     * @description begins looping background music if not muted
     */
    startBackgroundMusic() {
        if (!this.isMuted && this.BACKGROUND_MUSIC) {
            this.BACKGROUND_MUSIC.currentTime = 0;
            this.BACKGROUND_MUSIC.play().catch(e => console.warn('Background music play failed:', e));
        }
    }

    /**
     * @summary stops background music playback
     * @description pauses and resets background music position
     */
    stopBackgroundMusic() {
        if (this.BACKGROUND_MUSIC) {
            this.BACKGROUND_MUSIC.pause();
            this.BACKGROUND_MUSIC.currentTime = 0;
        }
    }

    /**
     * @summary plays specific sound effect by name
     * @description triggers SFX playback with volume control and mute check
     * @param {string} sfxName - name of sound effect from SFX object
     */
    playSFX(sfxName) {
        if (this.isMuted || !this.SFX[sfxName]) return;
        
        const sound = this.SFX[sfxName];
        sound.currentTime = 0;
        sound.play().catch(e => console.warn(`SFX ${sfxName} play failed:`, e));
    }

    /**
     * @summary toggles global audio mute state
     * @description switches between muted and unmuted state, saves settings
     * @returns {boolean} new mute state
     */
    toggleMute() {
        this.isMuted = !this.isMuted;
        
        if (this.isMuted) {
            this.stopBackgroundMusic();
        } else {
            if (window.gameStarted && !window.gameOver) {
                this.startBackgroundMusic();
            }
        }
        
        this.saveSettings();
        return this.isMuted;
    }

    /**
     * @summary sets master volume level
     * @description updates master volume and applies to all audio sources
     * @param {number} volume - volume level between 0.0 and 1.0
     */
    setMasterVolume(volume) {
        this.masterVolume = Math.max(0, Math.min(1, volume));
        this.musicVolume = this.masterVolume;
        this.sfxVolume = this.masterVolume;
        
        if (this.BACKGROUND_MUSIC) {
            this.BACKGROUND_MUSIC.volume = this.musicVolume;
        }
        
        this.applySFXVolume();
        this.saveSettings();
    }

    /**
     * @summary applies current volume settings to all SFX
     * @description sets volume for all sound effect Audio objects
     */
    applySFXVolume() {
        Object.values(this.SFX).forEach(sound => {
            sound.volume = this.sfxVolume;
        });
    }

    /**
     * @summary gets current master volume level
     * @description returns current master volume as percentage
     * @returns {number} volume level between 0.0 and 1.0
     */
    getMasterVolume() {
        return this.masterVolume;
    }

    /**
     * @summary checks if audio system is currently muted
     * @description returns current mute state
     * @returns {boolean} true if muted, false if active
     */
    isMutedState() {
        return this.isMuted;
    }

    /**
     * @summary stops specific sound effect by name
     * @description pauses and resets specified SFX audio
     * @param {string} sfxName - name of sound effect to stop
     */
    stopSFX(sfxName) {
        if (this.SFX[sfxName]) {
            this.SFX[sfxName].pause();
            this.SFX[sfxName].currentTime = 0;
        }
    }

    /**
     * @summary stops all audio playback immediately and completely
     * @description pauses music, resets all audio, and prevents new sounds for game over scenarios
     */
    stopAllAudio() {
        this.stopBackgroundMusic();
        Object.values(this.SFX).forEach(sound => {
            sound.pause();
            sound.currentTime = 0;
        });
    }

    /**
     * @summary completely shuts down audio system for game end
     * @description stops all sounds, disables new audio, removes event listeners
     */
    shutdownAudio() {
        this.stopAllAudio();
        this.isShuttingDown = true;
        
        Object.values(this.SFX).forEach(sound => {
            sound.onended = null;
            sound.onerror = null;
            sound.onloadeddata = null;
        });
        
        if (this.BACKGROUND_MUSIC) {
            this.BACKGROUND_MUSIC.onended = null;
            this.BACKGROUND_MUSIC.onerror = null;
            this.BACKGROUND_MUSIC.onloadeddata = null;
        }
    }

    /**
     * @summary reactivates audio system after shutdown
     * @description re-enables audio playback and resets shutdown flag
     */
    reactivateAudio() {
        this.isShuttingDown = false;
    }

    /**
     * @summary plays SFX only if audio system is not shut down
     * @description enhanced playSFX with shutdown check
     * @param {string} sfxName - name of sound effect from SFX object
     */
    playSFXSafe(sfxName) {
        if (this.isShuttingDown || this.isMuted || !this.SFX[sfxName]) return;
        
        const sound = this.SFX[sfxName];
        sound.currentTime = 0;
        sound.play().catch(e => console.warn(`SFX ${sfxName} play failed:`, e));
    }
}

window.SoundManager = SoundManager;