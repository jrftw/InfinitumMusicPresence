# Infinitum Music Activity

A Discord Rich Presence integration that shows your currently playing music from multiple sources in your Discord status.

## Features

- 🎵 Supports multiple music sources:
  - Apple Music
  - Amazon Music
  - Amazon Alexa
  - Spotify (coming soon)
  - YouTube Music (coming soon)
  - Tidal (coming soon)
  - Deezer (coming soon)
  - SoundCloud (coming soon)
- 🎮 Discord Rich Presence integration showing:
  - Song title
  - Artist
  - Album art
  - Elapsed/remaining time
  - Music source
- ⚡ Auto-updates every few seconds while music is playing
- 🎨 Customizable appearance in Discord
- 🖥️ System tray integration for easy control
- 🌐 Multi-platform support:
  - 🍎 macOS
  - 🪟 Windows
  - 📱 iOS (coming soon)
- 🔄 Automatic service detection and switching
- ⚙️ Per-service configuration options

## Prerequisites

- Node.js 16 or higher
- npm or yarn
- Discord desktop app
- One or more of the supported music services

## Installation

1. Clone this repository:
```bash
git clone https://github.com/yourusername/infinitum-music-activity.git
cd infinitum-music-activity
```

2. Install dependencies:
```bash
npm install
```

3. Create a Discord application:
   - Go to [Discord Developer Portal](https://discord.com/developers/applications)
   - Click "New Application"
   - Give it a name (e.g., "Music Presence")
   - Go to the "Rich Presence" tab
   - Add the following assets:
     - `music_note` (large image)
     - `play` (small image)
     - `pause` (small image)
   - Copy the Client ID

4. Update the Discord client ID:
   - Open `src/index.ts`
   - Replace `YOUR_DISCORD_CLIENT_ID` with your actual Discord application client ID

## Usage

1. Start the application:
```bash
npm start
```

2. The app will appear in your system tray
3. Enable/disable music services from the tray menu
4. Play music in any supported service
5. Your Discord status will automatically update with the current song information

## Development

- Run in development mode:
```bash
npm run dev
```

- Build the application:
```bash
npm run build
```

- Package for distribution:
```bash
npm run package
```

## Platform-Specific Notes

### macOS
- Supports Apple Music via AppleScript
- Supports Amazon Music via AppleScript
- Supports Alexa via Amazon API (requires authentication)

### Windows
- Supports Amazon Music via Windows Media Control
- Supports Spotify via Spotify Web API
- Supports Alexa via Amazon API (requires authentication)

### iOS (Coming Soon)
- Will support Apple Music via MusicKit
- Will support Spotify via Spotify Web API
- Will support Amazon Music via Amazon API

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Copyright

Copyright (c) 2025 Infinitum Imagery LLC 