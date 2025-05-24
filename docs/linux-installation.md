# Linux Installation Guide

## System Requirements
- Ubuntu 20.04+, Debian 11+, or equivalent
- x86_64 or ARM64 architecture
- 4GB RAM minimum
- 100MB free disk space
- Latest version of Discord
- GTK3 or Qt5 desktop environment

## Installation Steps

### Debian/Ubuntu (.deb)
1. Download the appropriate .deb package from the [Releases page](https://github.com/yourusername/InfinitumMusicActivity/releases):
   - For x86_64: `InfinitumMusicActivity-linux-x64.deb`
   - For ARM64: `InfinitumMusicActivity-linux-arm64.deb`

2. Install using dpkg:
   ```bash
   sudo dpkg -i InfinitumMusicActivity-linux-x64.deb
   sudo apt-get install -f  # Install dependencies
   ```

### AppImage
1. Download the AppImage from the [Releases page](https://github.com/yourusername/InfinitumMusicActivity/releases):
   - For x86_64: `InfinitumMusicActivity-linux-x64.AppImage`
   - For ARM64: `InfinitumMusicActivity-linux-arm64.AppImage`

2. Make it executable:
   ```bash
   chmod +x InfinitumMusicActivity-linux-x64.AppImage
   ```

3. Run the AppImage:
   ```bash
   ./InfinitumMusicActivity-linux-x64.AppImage
   ```

### Snap
```bash
sudo snap install infinitum-music-activity
```

## First-Time Setup

1. **Discord Integration**
   - Ensure Discord is running
   - The app will automatically connect to Discord
   - You may need to authorize the app in Discord

2. **Music Player Setup**
   - The app will automatically detect running music players
   - Supported players:
     - Spotify
     - Amazon Music
     - YouTube Music
     - Other players with MPRIS support

3. **Settings**
   - Click the system tray icon to access settings
   - Configure appearance, player preferences, and more
   - Enable/disable features as needed

## Troubleshooting

### Common Issues

#### App Won't Start
1. Check if another instance is running:
   ```bash
   ps aux | grep InfinitumMusicActivity
   ```
2. Verify system requirements
3. Check system logs:
   ```bash
   journalctl -u InfinitumMusicActivity
   ```
4. Try running from terminal:
   ```bash
   infinitum-music-activity --verbose
   ```

#### No System Tray Icon
1. Check if your desktop environment supports system tray
2. Install a system tray extension if needed
3. Check if the app is running:
   ```bash
   ps aux | grep InfinitumMusicActivity
   ```

#### Music Player Not Detected
1. Ensure the music player is running
2. Check if the player is supported
3. Try restarting both the app and music player
4. Check MPRIS support:
   ```bash
   qdbus org.mpris.MediaPlayer2.spotify /org/mpris/MediaPlayer2
   ```

### Logs
- Location: `~/.config/InfinitumMusicActivity/logs/`
- Check `main.log` for application errors
- Check `renderer.log` for UI issues
- View in terminal:
  ```bash
  tail -f ~/.config/InfinitumMusicActivity/logs/main.log
  ```

## Uninstallation

### Debian/Ubuntu (.deb)
```bash
sudo dpkg -r infinitum-music-activity
```

### AppImage
```bash
rm InfinitumMusicActivity-linux-x64.AppImage
```

### Snap
```bash
sudo snap remove infinitum-music-activity
```

## Support
- [GitHub Issues](https://github.com/yourusername/InfinitumMusicActivity/issues)
- [Discord Server](https://discord.gg/your-server)
- Email: support@infinitumimagery.com 