import { BaseMusicService, MusicInfo, MusicServiceConfig, MusicSource } from './MusicService';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export class WindowsMediaService extends BaseMusicService {
  private static instance: WindowsMediaService;

  private constructor(config: MusicServiceConfig) {
    super(config);
  }

  static getInstance(config: MusicServiceConfig): WindowsMediaService {
    if (!WindowsMediaService.instance) {
      WindowsMediaService.instance = new WindowsMediaService(config);
    }
    return WindowsMediaService.instance;
  }

  async getCurrentTrack(): Promise<MusicInfo> {
    // Use PowerShell to query Windows Media Control
    const script = `
      Add-Type -AssemblyName System.Windows.Forms
      $shell = New-Object -ComObject Shell.Application
      $shell.Windows() | ForEach-Object {
        if ($_.Name -match "Amazon Music|Spotify|YouTube Music") {
          $title = $_.Name
          $artist = $_.LocationName
          $album = $_.Location
          $duration = 0
          $position = 0
          $state = "playing"
          return "$title,$artist,$album,$duration,$position,$state"
        }
      }
    `;

    try {
      const { stdout } = await execAsync(`powershell -Command "${script}"`);
      if (!stdout.trim()) {
        throw new Error('No active media playback detected');
      }

      const [title, artist, album, duration, position, state] = stdout.trim().split(',');
      
      return {
        title,
        artist,
        album,
        duration: parseFloat(duration) || 0,
        position: parseFloat(position) || 0,
        isPlaying: state === 'playing',
        source: this.determineSource(title)
      };
    } catch (error) {
      console.error('Error getting current track:', error);
      throw error;
    }
  }

  private determineSource(title: string): MusicSource {
    if (title.includes('Amazon Music')) return MusicSource.AMAZON_MUSIC;
    if (title.includes('Spotify')) return MusicSource.SPOTIFY;
    if (title.includes('YouTube Music')) return MusicSource.YOUTUBE_MUSIC;
    return MusicSource.AMAZON_MUSIC; // Default to Amazon Music
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
        console.error('Error polling Windows Media:', error);
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