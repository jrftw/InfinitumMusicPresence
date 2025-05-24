import { app, Tray, Menu, nativeImage } from 'electron';
import { MusicServiceManager } from './services/MusicServiceManager';
import { DiscordService, DiscordConfig } from './services/DiscordService';
import { DiscordGameService, DiscordGameConfig } from './services/DiscordGameService';
import { MusicSource } from './services/MusicService';
import { WindowsMediaService } from './services/WindowsMediaService';
import path from 'path';

class MusicPresenceApp {
  private tray: Tray | null = null;
  private serviceManager: MusicServiceManager;
  private discord: DiscordService;
  private discordGame: DiscordGameService;
  private isRunning: boolean = false;

  constructor() {
    // Initialize service manager with platform-specific services
    this.serviceManager = MusicServiceManager.getInstance({
      services: {
        [MusicSource.APPLE_MUSIC]: { enabled: process.platform === 'darwin', updateInterval: 1000 },
        [MusicSource.AMAZON_MUSIC]: { enabled: true, updateInterval: 1000 },
        [MusicSource.ALEXA]: { enabled: true, updateInterval: 1000 },
        [MusicSource.SPOTIFY]: { enabled: true, updateInterval: 1000 },
        [MusicSource.YOUTUBE_MUSIC]: { enabled: true, updateInterval: 1000 }
      }
    });

    // Initialize Discord services
    const discordConfig: DiscordConfig = {
      clientId: '1375665759174393916',
      showAlbumArt: true,
      showTimeRemaining: true
    };

    const gameConfig: DiscordGameConfig = {
      clientId: '1375665759174393916',
      gameName: 'Music Presence',
      enableListenAlong: true
    };

    this.discord = DiscordService.getInstance(discordConfig);
    this.discordGame = DiscordGameService.getInstance(gameConfig);
  }

  async start(): Promise<void> {
    try {
      await Promise.all([
        this.discord.connect(),
        this.discordGame.connect()
      ]);
      this.setupTray();
      this.setupMusicListener();
      await this.serviceManager.start();
      this.isRunning = true;
      console.log('Music Presence is running');
    } catch (error) {
      console.error('Failed to start Music Presence:', error);
      app.quit();
    }
  }

  private setupTray(): void {
    const iconPath = path.join(__dirname, '../assets/icon.png');
    const trayIcon = nativeImage.createFromPath(iconPath).resize({ width: 32, height: 32 });
    this.tray = new Tray(trayIcon);
    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Status: Running',
        enabled: false
      },
      { type: 'separator' },
      {
        label: 'Services',
        submenu: [
          {
            label: 'Apple Music',
            type: 'checkbox',
            checked: process.platform === 'darwin',
            enabled: process.platform === 'darwin',
            click: (menuItem) => this.toggleService(MusicSource.APPLE_MUSIC, menuItem.checked)
          },
          {
            label: 'Amazon Music',
            type: 'checkbox',
            checked: true,
            click: (menuItem) => this.toggleService(MusicSource.AMAZON_MUSIC, menuItem.checked)
          },
          {
            label: 'Amazon Alexa',
            type: 'checkbox',
            checked: true,
            click: (menuItem) => this.toggleService(MusicSource.ALEXA, menuItem.checked)
          },
          {
            label: 'Spotify',
            type: 'checkbox',
            checked: true,
            click: (menuItem) => this.toggleService(MusicSource.SPOTIFY, menuItem.checked)
          },
          {
            label: 'YouTube Music',
            type: 'checkbox',
            checked: true,
            click: (menuItem) => this.toggleService(MusicSource.YOUTUBE_MUSIC, menuItem.checked)
          }
        ]
      },
      {
        label: 'Features',
        submenu: [
          {
            label: 'Listen Along',
            type: 'checkbox',
            checked: true,
            click: (menuItem) => this.toggleListenAlong(menuItem.checked)
          }
        ]
      },
      { type: 'separator' },
      {
        label: 'Quit',
        click: () => this.quit()
      }
    ]);
    this.tray.setToolTip('Music Presence');
    this.tray.setContextMenu(contextMenu);
  }

  private setupMusicListener(): void {
    this.serviceManager.addListener(async (musicInfo) => {
      await Promise.all([
        this.discord.updatePresence(musicInfo),
        this.discordGame.updatePresence(musicInfo)
      ]);
    });
  }

  private toggleService(source: MusicSource, enabled: boolean): void {
    this.serviceManager.setServiceConfig(source, { enabled });
  }

  private toggleListenAlong(enabled: boolean): void {
    this.discordGame.setConfig({ enableListenAlong: enabled });
  }

  async quit(): Promise<void> {
    if (!this.isRunning) return;

    await this.serviceManager.stop();
    await Promise.all([
      this.discord.disconnect(),
      this.discordGame.disconnect()
    ]);
    if (this.tray) {
      this.tray.destroy();
    }
    this.isRunning = false;
    app.quit();
  }
}

// Initialize the app
app.whenReady().then(() => {
  const musicPresence = new MusicPresenceApp();
  musicPresence.start();
});

// Handle app lifecycle
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (app.getTray()) {
    app.getTray().show();
  }
}); 