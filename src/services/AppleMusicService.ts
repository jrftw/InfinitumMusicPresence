import { exec } from 'child_process';
import { promisify } from 'util';
import { BaseMusicService, MusicInfo, MusicServiceConfig, MusicSource } from './MusicService';

const execAsync = promisify(exec);

export class AppleMusicService extends BaseMusicService {
  private static instance: AppleMusicService;

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
      
      return {
        title,
        artist,
        album,
        duration: parseFloat(duration),
        position: parseFloat(position),
        isPlaying: state === 'playing',
        source: MusicSource.APPLE_MUSIC
      };
    } catch (error) {
      console.error('Error getting current track:', error);
      throw error;
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
        console.error('Error polling Apple Music:', error);
      }
    }, this.config.updateInterval || 1000);
  }

  stopPolling(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }
} 