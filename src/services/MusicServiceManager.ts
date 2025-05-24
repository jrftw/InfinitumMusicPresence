import { BaseMusicService, MusicInfo, MusicServiceConfig, MusicSource } from './MusicService';
import { AppleMusicService } from './AppleMusicService';
import { AmazonMusicService } from './AmazonMusicService';

export interface ServiceManagerConfig {
  services: {
    [key in MusicSource]?: MusicServiceConfig;
  };
}

export class MusicServiceManager {
  private static instance: MusicServiceManager;
  private services: Map<MusicSource, BaseMusicService> = new Map();
  private activeService: BaseMusicService | null = null;
  private listeners: ((info: MusicInfo) => void)[] = [];

  private constructor(config: ServiceManagerConfig) {
    this.initializeServices(config);
  }

  static getInstance(config: ServiceManagerConfig): MusicServiceManager {
    if (!MusicServiceManager.instance) {
      MusicServiceManager.instance = new MusicServiceManager(config);
    }
    return MusicServiceManager.instance;
  }

  private initializeServices(config: ServiceManagerConfig): void {
    // Initialize Apple Music
    if (config.services[MusicSource.APPLE_MUSIC]?.enabled) {
      const appleMusic = AppleMusicService.getInstance(config.services[MusicSource.APPLE_MUSIC]!);
      this.services.set(MusicSource.APPLE_MUSIC, appleMusic);
    }

    // Initialize Amazon Music
    if (config.services[MusicSource.AMAZON_MUSIC]?.enabled) {
      const amazonMusic = AmazonMusicService.getInstance(config.services[MusicSource.AMAZON_MUSIC]!);
      this.services.set(MusicSource.AMAZON_MUSIC, amazonMusic);
    }

    // Add more services here as they are implemented
  }

  async start(): Promise<void> {
    // Start all enabled services
    for (const service of this.services.values()) {
      service.startPolling();
      service.addListener(this.handleMusicUpdate.bind(this));
    }
  }

  async stop(): Promise<void> {
    // Stop all services
    for (const service of this.services.values()) {
      service.stopPolling();
    }
    this.activeService = null;
  }

  private async handleMusicUpdate(info: MusicInfo): Promise<void> {
    // Only update if this is the first service to report activity
    // or if it's the currently active service
    if (!this.activeService || this.activeService === this.services.get(info.source)) {
      this.activeService = this.services.get(info.source) || null;
      this.notifyListeners(info);
    }
  }

  addListener(listener: (info: MusicInfo) => void): void {
    this.listeners.push(listener);
  }

  removeListener(listener: (info: MusicInfo) => void): void {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  private notifyListeners(info: MusicInfo): void {
    this.listeners.forEach(listener => listener(info));
  }

  getActiveService(): BaseMusicService | null {
    return this.activeService;
  }

  setServiceConfig(source: MusicSource, config: Partial<MusicServiceConfig>): void {
    const service = this.services.get(source);
    if (service) {
      service.setConfig(config);
    }
  }
} 