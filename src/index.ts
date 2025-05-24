import { app, Tray, Menu, nativeImage, BrowserWindow, ipcMain } from 'electron';
import { MusicServiceManager } from './services/MusicServiceManager';
import { DiscordService, DiscordConfig } from './services/DiscordService';
import { DiscordGameService, DiscordGameConfig } from './services/DiscordGameService';
import { MusicSource, MusicInfo } from './services/MusicService';
import { WindowsMediaService } from './services/WindowsMediaService';
import path from 'path';
import findProcess from 'find-process';

let mainWindow: BrowserWindow | null = null;

app.setName('Infinitum Music Activity');

class MusicPresenceApp {
  private tray: Tray | null = null;
  private serviceManager: MusicServiceManager;
  private discord: DiscordService;
  private discordGame: DiscordGameService;
  private isRunning: boolean = false;
  private lastSongInfo: MusicInfo | null = null;
  private settings = {
    active: true,
    appearance: 'auto',
    player: 'auto',
    showAlbumArt: true,
    showTime: true
  };

  constructor() {
    // All services disabled by default
    this.serviceManager = MusicServiceManager.getInstance({
      services: {
        [MusicSource.APPLE_MUSIC]: { enabled: false, updateInterval: 2000 },
        [MusicSource.AMAZON_MUSIC]: { enabled: false, updateInterval: 2000 },
        [MusicSource.ALEXA]: { enabled: false, updateInterval: 2000 },
        [MusicSource.SPOTIFY]: { enabled: false, updateInterval: 2000 },
        [MusicSource.YOUTUBE_MUSIC]: { enabled: false, updateInterval: 2000 }
      }
    });

    const discordConfig: DiscordConfig = {
      clientId: '1375665759174393916',
      showAlbumArt: true,
      showTimeRemaining: true
    };

    const gameConfig: DiscordGameConfig = {
      clientId: '1375665759174393916',
      gameName: 'Infinitum Music Activity',
      enableListenAlong: true
    };

    this.discord = DiscordService.getInstance(discordConfig);
    this.discordGame = DiscordGameService.getInstance(gameConfig);
  }

  async start(): Promise<void> {
    try {
      // Setup IPC first
      this.setupIPC();
      
      // Then connect to Discord services
      await Promise.all([
        this.discord.connect(),
        this.discordGame.connect()
      ]);

      // Create window and setup UI
      this.createMainWindow();
      this.setupTray();
      this.setupMusicListener();
      
      // Start services
      await this.serviceManager.start();
      await this.autoDetectAndEnableService();
      
      this.isRunning = true;
      console.log('Infinitum Music Activity is running');
    } catch (error) {
      console.error('Failed to start Infinitum Music Activity:', error);
      app.quit();
    }
  }

  private setupIPC(): void {
    // Remove any existing handlers first
    ipcMain.removeHandler('get-song-info');
    ipcMain.removeHandler('get-settings');

    // Register new handlers
    ipcMain.handle('get-song-info', () => {
      try {
        return this.lastSongInfo;
      } catch (error) {
        console.error('Error getting song info:', error);
        return null;
      }
    });

    ipcMain.handle('get-settings', () => {
      try {
        return this.settings;
      } catch (error) {
        console.error('Error getting settings:', error);
        return this.settings;
      }
    });

    ipcMain.on('set-setting', (event, key, value) => {
      try {
        (this.settings as any)[key] = value;
        this.setupTray();
        if (mainWindow) {
          mainWindow.webContents.send('settings', this.settings);
        }
      } catch (error) {
        console.error('Error setting setting:', error);
      }
    });

    ipcMain.on('toggle-active', (event, value) => {
      try {
        this.settings.active = value;
        this.setupTray();
        if (mainWindow) {
          mainWindow.webContents.send('settings', this.settings);
        }
      } catch (error) {
        console.error('Error toggling active state:', error);
      }
    });
  }

  private createMainWindow(): void {
    if (mainWindow) return;
    mainWindow = new BrowserWindow({
      width: 900,
      height: 700,
      title: 'Infinitum Music Activity',
      icon: path.join(__dirname, '../assets/image1.png'),
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      },
    });
    mainWindow.loadFile(path.join(__dirname, '../assets/index.html'));
    mainWindow.on('closed', () => {
      mainWindow = null;
    });
  }

  private setupTray(): void {
    const iconPath = path.join(__dirname, '../assets/image1.png');
    const trayIcon = nativeImage.createFromPath(iconPath).resize({ width: 32, height: 32 });
    this.tray = new Tray(trayIcon);
    this.tray.setToolTip('Infinitum Music Activity');
    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Infinitum Music Activity: Running',
        enabled: false
      },
      { type: 'separator' },
      {
        label: 'Show App',
        click: () => {
          if (mainWindow) {
            mainWindow.show();
            mainWindow.focus();
          } else {
            this.createMainWindow();
          }
        }
      },
      {
        label: 'Active',
        type: 'checkbox',
        checked: this.settings.active,
        click: (menuItem) => this.toggleActive(menuItem.checked)
      },
      {
        label: 'Appearance',
        submenu: [
          { label: 'Auto', type: 'radio', checked: this.settings.appearance === 'auto', click: () => this.setAppearance('auto') },
          { label: 'Light', type: 'radio', checked: this.settings.appearance === 'light', click: () => this.setAppearance('light') },
          { label: 'Dark', type: 'radio', checked: this.settings.appearance === 'dark', click: () => this.setAppearance('dark') }
        ]
      },
      {
        label: 'Player',
        submenu: [
          { label: 'Auto', type: 'radio', checked: this.settings.player === 'auto', click: () => this.setPlayer('auto') },
          { label: 'Apple Music', type: 'radio', checked: this.settings.player === 'apple', click: () => this.setPlayer('apple') },
          { label: 'Spotify', type: 'radio', checked: this.settings.player === 'spotify', click: () => this.setPlayer('spotify') },
          { label: 'Amazon Music', type: 'radio', checked: this.settings.player === 'amazon', click: () => this.setPlayer('amazon') }
        ]
      },
      {
        label: 'Settings',
        submenu: [
          { label: 'Show Album Art', type: 'checkbox', checked: this.settings.showAlbumArt, click: (menuItem) => this.setShowAlbumArt(menuItem.checked) },
          { label: 'Show Time', type: 'checkbox', checked: this.settings.showTime, click: (menuItem) => this.setShowTime(menuItem.checked) }
        ]
      },
      { type: 'separator' },
      {
        label: 'Quit',
        click: () => this.quit()
      }
    ]);
    this.tray.setContextMenu(contextMenu);
  }

  private setupMusicListener(): void {
    this.serviceManager.addListener(async (musicInfo) => {
      try {
        this.lastSongInfo = musicInfo;
        if (mainWindow) {
          mainWindow.webContents.send('song-info', musicInfo);
        }
        
        if (this.settings.active) {
          await Promise.all([
            this.discord.updatePresence(musicInfo),
            this.discordGame.updatePresence(musicInfo)
          ]);
        }
      } catch (error) {
        console.error('Error updating music presence:', error);
      }
    });
  }

  private toggleService(source: MusicSource, enabled: boolean): void {
    this.serviceManager.setServiceConfig(source, { enabled });
  }

  private toggleActive(enabled: boolean): void {
    this.settings.active = enabled;
    this.setupTray();
    if (mainWindow) mainWindow.webContents.send('settings', this.settings);
  }

  private setAppearance(mode: string): void {
    this.settings.appearance = mode;
    this.setupTray();
    if (mainWindow) mainWindow.webContents.send('settings', this.settings);
  }

  private setPlayer(player: string): void {
    this.settings.player = player;
    this.setupTray();
    if (mainWindow) mainWindow.webContents.send('settings', this.settings);
  }

  private setShowAlbumArt(show: boolean): void {
    this.settings.showAlbumArt = show;
    this.setupTray();
    if (mainWindow) mainWindow.webContents.send('settings', this.settings);
  }

  private setShowTime(show: boolean): void {
    this.settings.showTime = show;
    this.setupTray();
    if (mainWindow) mainWindow.webContents.send('settings', this.settings);
  }

  // Auto-detect running music apps and enable the correct service
  private async autoDetectAndEnableService(): Promise<void> {
    try {
      const processes = await findProcess('name', '');
      const lowerNames = processes.map((p: any) => p.name.toLowerCase());
      
      // More robust Apple Music detection for macOS
      if (process.platform === 'darwin') {
        const musicProcesses = ['music', 'applemusic', 'itunes'];
        const hasMusicApp = musicProcesses.some(name => 
          lowerNames.some((p: string) => p.includes(name))
        );
        
        if (hasMusicApp) {
          console.log('Apple Music detected, enabling service...');
          this.toggleService(MusicSource.APPLE_MUSIC, true);
          // Wait a moment for the service to initialize
          await new Promise(resolve => setTimeout(resolve, 1000));
          console.log('Apple Music service enabled.');
        }
      }
      
      // Check for other music services
      if (lowerNames.some((name: string) => name.includes('amazon'))) {
        console.log('Amazon Music detected, enabling service...');
        this.toggleService(MusicSource.AMAZON_MUSIC, true);
      } else if (lowerNames.some((name: string) => name.includes('spotify'))) {
        console.log('Spotify detected, enabling service...');
        this.toggleService(MusicSource.SPOTIFY, true);
      } else if (lowerNames.some((name: string) => name.includes('youtube'))) {
        console.log('YouTube Music detected, enabling service...');
        this.toggleService(MusicSource.YOUTUBE_MUSIC, true);
      }
      
      // If no service was enabled, log a message
      if (!this.serviceManager.isAnyServiceEnabled()) {
        console.log('No supported music player detected. Please start a supported music player or enable a service manually from the tray menu.');
      }
    } catch (error) {
      console.error('Error during service auto-detection:', error);
    }
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