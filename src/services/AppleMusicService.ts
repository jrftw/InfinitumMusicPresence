import { exec } from 'child_process';
import { promisify } from 'util';
import { BaseMusicService, MusicInfo, MusicServiceConfig, MusicSource } from './MusicService';

const execAsync = promisify(exec);

export class AppleMusicService extends BaseMusicService {
  private static instance: AppleMusicService;
  private lastError: string | null = null;

  private constructor(config: MusicServiceConfig) {
    super(config);
  }

  static getInstance(config: MusicServiceConfig): AppleMusicService {
    if (!AppleMusicService.instance) {
      AppleMusicService.instance = new AppleMusicService(config);
    }
    return AppleMusicService.instance;
  }

  async getCurrentTrack(): Promise<MusicInfo> {
    const script = `
      tell application \"Music\"
        if player state is playing then
          set currentTrack to current track
          set trackInfo to {name of currentTrack, artist of currentTrack, album of currentTrack, duration of currentTrack, player position, player state}
          return trackInfo
        end if
      end tell
    `;

    try {
      const { stdout } = await execAsync(`osascript -e '${script}'`);
      const [title, artist, album, duration, position, state] = stdout.trim().split(', ');
      this.lastError = null;
      return {
        title,
        artist,
        album,
        duration: parseFloat(duration),
        position: parseFloat(position),
        isPlaying: state === 'playing',
        source: MusicSource.APPLE_MUSIC
      };
    } catch (error: any) {
      // Only log if the error is new to avoid spamming
      if (this.lastError !== error?.message) {
        this.lastError = error?.message;
        if (error.code === 'EIO') {
          console.warn('[AppleMusicService] System I/O error (EIO) when accessing Apple Music. This may be a temporary system issue.');
        } else if (error.killed || error.signal) {
          console.warn('[AppleMusicService] osascript process was killed or interrupted.');
        } else {
          console.warn('[AppleMusicService] Failed to get current track from Apple Music:', error.message || error);
        }
      }
      // Return a paused/empty state instead of throwing
      return {
        title: '',
        artist: '',
        album: '',
        duration: 0,
        position: 0,
        isPlaying: false,
        source: MusicSource.APPLE_MUSIC
      };
    }
  }

  startPolling(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }

    this.updateInterval = setInterval(async () => {
      try {
        const trackInfo = await this.getCurrentTrack();
        this.notifyListeners(trackInfo);
      } catch (error) {
        // Already handled in getCurrentTrack
      }
    }, this.config.updateInterval || 2000); // Use a safer 2s interval
  }

  stopPolling(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }
} 