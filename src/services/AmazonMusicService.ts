import { BaseMusicService, MusicInfo, MusicServiceConfig, MusicSource } from './MusicService';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export class AmazonMusicService extends BaseMusicService {
  private static instance: AmazonMusicService;
  private alexaToken: string | null = null;

  private constructor(config: MusicServiceConfig) {
    super(config);
  }

  static getInstance(config: MusicServiceConfig): AmazonMusicService {
    if (!AmazonMusicService.instance) {
      AmazonMusicService.instance = new AmazonMusicService(config);
    }
    return AmazonMusicService.instance;
  }

  async getCurrentTrack(): Promise<MusicInfo> {
    // Try desktop app first
    try {
      const desktopInfo = await this.getDesktopTrack();
      if (desktopInfo) return desktopInfo;
    } catch (error) {
      console.error('Error getting desktop track:', error);
    }

    // Try Alexa if configured
    if (this.alexaToken) {
      try {
        const alexaInfo = await this.getAlexaTrack();
        if (alexaInfo) return alexaInfo;
      } catch (error) {
        console.error('Error getting Alexa track:', error);
      }
    }

    throw new Error('No active Amazon Music playback detected');
  }

  private async getDesktopTrack(): Promise<MusicInfo | null> {
    const script = `
      tell application "Amazon Music"
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
        source: MusicSource.AMAZON_MUSIC
      };
    } catch (error) {
      return null;
    }
  }

  private async getAlexaTrack(): Promise<MusicInfo | null> {
    // This would require Amazon Alexa API integration
    // You would need to:
    // 1. Implement OAuth2 flow for Alexa API
    // 2. Use the Alexa API to get current playback
    // 3. Handle token refresh and error cases
    return null;
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
        console.error('Error polling Amazon Music:', error);
      }
    }, this.config.updateInterval || 1000);
  }

  stopPolling(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  setAlexaToken(token: string): void {
    this.alexaToken = token;
  }
} 