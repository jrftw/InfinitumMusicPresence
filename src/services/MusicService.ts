export interface MusicInfo {
  title: string;
  artist: string;
  album: string;
  duration: number;
  position: number;
  artwork?: string;
  isPlaying: boolean;
  source: MusicSource;
}

export enum MusicSource {
  APPLE_MUSIC = 'Apple Music',
  SPOTIFY = 'Spotify',
  AMAZON_MUSIC = 'Amazon Music',
  ALEXA = 'Amazon Alexa',
  YOUTUBE_MUSIC = 'YouTube Music',
  TIDAL = 'Tidal',
  DEEZER = 'Deezer',
  SOUNDCLOUD = 'SoundCloud'
}

export interface MusicServiceConfig {
  enabled: boolean;
  updateInterval?: number;
}

export abstract class BaseMusicService {
  protected updateInterval: NodeJS.Timeout | null = null;
  protected listeners: ((info: MusicInfo) => void)[] = [];
  protected config: MusicServiceConfig;

  constructor(config: MusicServiceConfig) {
    this.config = config;
  }

  abstract getCurrentTrack(): Promise<MusicInfo>;
  abstract startPolling(): void;
  abstract stopPolling(): void;

  addListener(listener: (info: MusicInfo) => void): void {
    this.listeners.push(listener);
  }

  removeListener(listener: (info: MusicInfo) => void): void {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  protected notifyListeners(info: MusicInfo): void {
    this.listeners.forEach(listener => listener(info));
  }

  setConfig(config: Partial<MusicServiceConfig>): void {
    this.config = { ...this.config, ...config };
    if (this.updateInterval) {
      this.stopPolling();
      this.startPolling();
    }
  }

  isEnabled(): boolean {
    return this.config.enabled;
  }
} 