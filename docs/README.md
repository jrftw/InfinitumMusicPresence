# Infinitum Music Activity Wiki

## Table of Contents
1. [Getting Started](#getting-started)
2. [Features](#features)
3. [Configuration](#configuration)
4. [Troubleshooting](#troubleshooting)
5. [Development](#development)

## Getting Started

### System Requirements
- **Windows**: Windows 10 or later (x64 or x86)
- **macOS**: macOS 10.15 or later (Intel or Apple Silicon)
- **Linux**: Ubuntu 20.04 or later, or equivalent (x64 or ARM)
- **Discord**: Latest version
- **Music Players**: Any supported music player (see below)

### Installation
1. Download the appropriate version for your system from the [Releases page](https://github.com/yourusername/InfinitumMusicActivity/releases)
2. Follow the installation instructions for your platform:
   - [Windows Installation Guide](windows-installation.md)
   - [macOS Installation Guide](macos-installation.md)
   - [Linux Installation Guide](linux-installation.md)

## Features

### Music Player Support
- **Apple Music**
  - Native macOS integration
  - Real-time playback status
  - Album art support
  - Time remaining/elapsed

- **Spotify**
  - Official API integration
  - Podcast support
  - Listen Along feature
  - Cross-platform links

- **Amazon Music**
  - Desktop app integration
  - Alexa device support
  - Album art extraction
  - Playback controls

- **YouTube Music**
  - Browser extension support
  - Desktop app detection
  - Playback status
  - Time tracking

### Discord Integration

#### Rich Presence
- Current song information
- Album artwork
- Play/pause status
- Time remaining/elapsed
- Listen Along button
- Multi-platform song links

#### Listen Along
- Real-time sync with friends
- Group sessions
- Cross-platform support
- Playback controls

### UI Features
- Modern, Apple-inspired design
- Dark/Light mode
- Real-time updates
- Interactive settings
- Tray icon with status
- Main window dashboard

## Configuration

### Discord Setup
1. Create a new application at [Discord Developer Portal](https://discord.com/developers/applications)
2. Enable Rich Presence
3. Copy your Client ID
4. Update the app configuration

### Music Services
Each music service can be configured individually:

#### Apple Music
```json
{
  "enabled": true,
  "updateInterval": 2000,
  "showAlbumArt": true,
  "showTime": true
}
```

#### Spotify
```json
{
  "enabled": true,
  "updateInterval": 2000,
  "showPodcasts": true,
  "listenAlong": true
}
```

### Appearance
- **Theme**: Auto, Light, or Dark
- **Album Art**: Show/hide
- **Time Display**: Show/hide
- **Player Name**: Show/hide

## Troubleshooting

### Common Issues

#### App Not Detecting Music Player
1. Ensure the music player is running
2. Check if the service is enabled in settings
3. Verify the player is supported
4. Try restarting the app

#### Discord Rich Presence Not Working
1. Check Discord is running
2. Verify internet connection
3. Ensure the app is active
4. Check Discord permissions

#### Album Art Not Showing
1. Verify "Show Album Art" is enabled
2. Check if the player provides artwork
3. Try refreshing the app
4. Check file permissions

### Logs
- Windows: `%APPDATA%\InfinitumMusicActivity\logs`
- macOS: `~/Library/Logs/InfinitumMusicActivity`
- Linux: `~/.config/InfinitumMusicActivity/logs`

## Development

### Building from Source
1. Clone the repository
2. Install dependencies
3. Build the project
4. Run in development mode

### Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

### API Documentation
- [Discord Rich Presence API](https://discord.com/developers/docs/rich-presence/how-to)
- [Apple Music API](https://developer.apple.com/documentation/applemusicapi)
- [Spotify Web API](https://developer.spotify.com/documentation/web-api)

### Testing
- Unit tests: `npm test`
- Integration tests: `npm run test:integration`
- E2E tests: `npm run test:e2e`

---

For more information, visit our [GitHub repository](https://github.com/yourusername/InfinitumMusicActivity) or join our [Discord server](https://discord.gg/your-server). 