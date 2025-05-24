// @ts-ignore
// eslint-disable-next-line
declare module 'discord-rpc';

import { Client } from 'discord-rpc';
import { MusicInfo } from './MusicService';

export interface DiscordConfig {
  clientId: string;
  customEmoji?: string;
  showAlbumArt?: boolean;
  showTimeRemaining?: boolean;
}

export class DiscordService {
  private static instance: DiscordService;
  private client: any;
  private config: DiscordConfig;
  private connected: boolean = false;

  private constructor(config: DiscordConfig) {
    this.config = config;
    this.client = new Client({ transport: 'ipc' });
  }

  static getInstance(config: DiscordConfig): DiscordService {
    if (!DiscordService.instance) {
      DiscordService.instance = new DiscordService(config);
    }
    return DiscordService.instance;
  }

  async connect(): Promise<void> {
    if (this.connected) return;

    try {
      await this.client.login({ clientId: this.config.clientId });
      this.connected = true;
      console.log('Connected to Discord');
    } catch (error) {
      console.error('Failed to connect to Discord:', error);
      throw error;
    }
  }

  async updatePresence(musicInfo: MusicInfo): Promise<void> {
    if (!this.connected) {
      await this.connect();
    }

    const { title, artist, album, duration, position, isPlaying } = musicInfo;
    const remainingTime = duration - position;

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
    };

    try {
      await this.client.setActivity(activity);
    } catch (error) {
      console.error('Failed to update Discord presence:', error);
      this.connected = false;
    }
  }

  async disconnect(): Promise<void> {
    if (!this.connected) return;

    try {
      await this.client.destroy();
      this.connected = false;
      console.log('Disconnected from Discord');
    } catch (error) {
      console.error('Failed to disconnect from Discord:', error);
    }
  }
} 