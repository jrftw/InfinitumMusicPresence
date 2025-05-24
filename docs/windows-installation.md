# Windows Installation Guide

## System Requirements
- Windows 10 or later
- 64-bit (x64) or 32-bit (x86) processor
- 4GB RAM minimum
- 100MB free disk space
- Latest version of Discord

## Installation Steps

### Standard Installation
1. Download the appropriate installer from the [Releases page](https://github.com/yourusername/InfinitumMusicActivity/releases):
   - For 64-bit Windows: `InfinitumMusicActivity-Setup-x64.exe`
   - For 32-bit Windows: `InfinitumMusicActivity-Setup-x86.exe`

2. Run the installer:
   - Double-click the downloaded `.exe` file
   - If you see a security warning, click "More info" and then "Run anyway"
   - Follow the installation wizard

3. Launch the app:
   - The app will start automatically after installation
   - A tray icon will appear in your system tray
   - The main window will open

### Portable Installation
1. Download the portable version:
   - `InfinitumMusicActivity-win32-x64.zip` for 64-bit
   - `InfinitumMusicActivity-win32-x86.zip` for 32-bit

2. Extract the ZIP file:
   - Right-click the ZIP file
   - Select "Extract All..."
   - Choose a location
   - Click "Extract"

3. Run the app:
   - Navigate to the extracted folder
   - Double-click `InfinitumMusicActivity.exe`

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
     - Windows Media Player

3. **Settings**
   - Click the tray icon to access settings
   - Configure appearance, player preferences, and more
   - Enable/disable features as needed

## Troubleshooting

### Common Issues

#### App Won't Start
1. Check if another instance is running
2. Verify system requirements
3. Try running as administrator
4. Check Windows Event Viewer for errors

#### No Tray Icon
1. Check if the app is running in Task Manager
2. Restart the app
3. Check Windows notification settings

#### Music Player Not Detected
1. Ensure the music player is running
2. Check if the player is supported
3. Try restarting both the app and music player

### Logs
- Location: `%APPDATA%\InfinitumMusicActivity\logs`
- Check `main.log` for application errors
- Check `renderer.log` for UI issues

## Uninstallation

### Standard Installation
1. Open Windows Settings
2. Go to Apps & Features
3. Find "Infinitum Music Activity"
4. Click Uninstall
5. Follow the prompts

### Portable Installation
1. Close the app
2. Delete the extracted folder
3. Remove any shortcuts you created

## Support
- [GitHub Issues](https://github.com/yourusername/InfinitumMusicActivity/issues)
- [Discord Server](https://discord.gg/your-server)
- Email: support@infinitumimagery.com 