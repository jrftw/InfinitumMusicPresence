import { Client } from 'discord-rpc';
import { MusicInfo } from './MusicService';

export interface DiscordGameConfig {
  clientId: string;
  gameName: string;
  gameIcon?: string;
  enableListenAlong?: boolean;
}

export class DiscordGameService {
  private static instance: DiscordGameService;
  private client: Client;
  private config: DiscordGameConfig;
  private connected: boolean = false;

  private constructor(config: DiscordGameConfig) {
    this.config = config;
    this.client = new Client({ transport: 'ipc' });
  }

  static getInstance(config: DiscordGameConfig): DiscordGameService {
    if (!DiscordGameService.instance) {
      DiscordGameService.instance = new DiscordGameService(config);
    }
    return DiscordGameService.instance;
  }

  async connect(): Promise<void> {
    if (this.connected) return;

    try {
      await this.client.login({ clientId: this.config.clientId });
      this.connected = true;
      console.log('Connected to Discord Game Service');
    } catch (error) {
      console.error('Failed to connect to Discord Game Service:', error);
      throw error;
    }
  }

  async updatePresence(musicInfo: MusicInfo): Promise<void> {
    if (!this.connected) {
      await this.connect();
    }

    const { title, artist, album, duration, position, isPlaying, source } = musicInfo;
    const remainingTime = duration - position;

    // Create a shareable link based on the music source
    const shareLink = this.createShareLink(musicInfo);

    const activity = {
      details: title,
      state: `by ${artist}`,
      largeImageKey: 'music_note',
      largeImageText: album,
      smallImageKey: isPlaying ? 'play' : 'pause',
      smallImageText: isPlaying ? 'Playing' : 'Paused',
      startTimestamp: isPlaying ? Date.now() - (position * 1000) : undefined,
      endTimestamp: isPlaying ? Date.now() + (remainingTime * 1000) : undefined,
      instance: false,
      buttons: this.config.enableListenAlong ? [
        {
          label: 'Listen Along',
          url: shareLink
        }
      ] : undefined
    };

    try {
      await this.client.setActivity(activity);
    } catch (error) {
      console.error('Failed to update Discord game presence:', error);
      this.connected = false;
    }
  }

  private createShareLink(musicInfo: MusicInfo): string {
    const { title, artist, source } = musicInfo;
    const encodedTitle = encodeURIComponent(`${title} ${artist}`);

    switch (source) {
      case 'Apple Music':
        return `https://music.apple.com/search?term=${encodedTitle}`;
      case 'Spotify':
        return `https://open.spotify.com/search/${encodedTitle}`;
      case 'Amazon Music':
        return `https://music.amazon.com/search/${encodedTitle}`;
      case 'YouTube Music':
        return `https://music.youtube.com/search?q=${encodedTitle}`;
      default:
        return `https://www.google.com/search?q=${encodedTitle}`;
    }
  }

  async disconnect(): Promise<void> {
    if (!this.connected) return;

    try {
      await this.client.destroy();
      this.connected = false;
      console.log('Disconnected from Discord Game Service');
    } catch (error) {
      console.error('Failed to disconnect from Discord Game Service:', error);
    }
  }

  setConfig(config: Partial<DiscordGameConfig>): void {
    this.config = { ...this.config, ...config };
  }
} 