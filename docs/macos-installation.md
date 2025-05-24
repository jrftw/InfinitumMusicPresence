# macOS Installation Guide

## System Requirements
- macOS 10.15 (Catalina) or later
- Intel Mac or Apple Silicon (M1/M2)
- 4GB RAM minimum
- 100MB free disk space
- Latest version of Discord

## Installation Steps

### Standard Installation
1. Download the appropriate DMG from the [Releases page](https://github.com/yourusername/InfinitumMusicActivity/releases):
   - For Intel Macs: `InfinitumMusicActivity-darwin-x64.dmg`
   - For Apple Silicon: `InfinitumMusicActivity-darwin-arm64.dmg`

2. Install the app:
   - Double-click the downloaded `.dmg` file
   - Drag the app to your Applications folder
   - Eject the DMG

3. First Launch:
   - Open the app from your Applications folder
   - If you see a security warning:
     1. Go to System Preferences > Security & Privacy
     2. Click "Open Anyway"
     3. Confirm the action

### Homebrew Installation
```bash
# Add the tap
brew tap yourusername/infinitum-music-activity

# Install the app
brew install infinitum-music-activity
```

## First-Time Setup

1. **Discord Integration**
   - Ensure Discord is running
   - The app will automatically connect to Discord
   - You may need to authorize the app in Discord

2. **Music Player Setup**
   - The app will automatically detect running music players
   - Supported players:
     - Apple Music
     - Spotify
     - Amazon Music
     - YouTube Music

3. **Settings**
   - Click the menu bar icon to access settings
   - Configure appearance, player preferences, and more
   - Enable/disable features as needed

## Troubleshooting

### Common Issues

#### App Won't Start
1. Check if another instance is running
2. Verify system requirements
3. Check Console.app for errors
4. Try running from Terminal:
   ```bash
   /Applications/InfinitumMusicActivity.app/Contents/MacOS/InfinitumMusicActivity
   ```

#### No Menu Bar Icon
1. Check if the app is running in Activity Monitor
2. Restart the app
3. Check System Preferences > Notifications

#### Music Player Not Detected
1. Ensure the music player is running
2. Check if the player is supported
3. Try restarting both the app and music player
4. Check System Preferences > Security & Privacy > Privacy > Automation

### Logs
- Location: `~/Library/Logs/InfinitumMusicActivity`
- Check `main.log` for application errors
- Check `renderer.log` for UI issues
- View in Console.app:
  1. Open Console.app
  2. Select your Mac in the sidebar
  3. Search for "InfinitumMusicActivity"

## Uninstallation

### Standard Installation
1. Open Finder
2. Go to Applications
3. Drag InfinitumMusicActivity to Trash
4. Empty Trash

### Homebrew Installation
```bash
brew uninstall infinitum-music-activity
```

## Support
- [GitHub Issues](https://github.com/yourusername/InfinitumMusicActivity/issues)
- [Discord Server](https://discord.gg/your-server)
- Email: support@infinitumimagery.com 