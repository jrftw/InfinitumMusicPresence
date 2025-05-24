# Music Presence

Music Presence is a cross-platform, open-source app that shows your music activity on Discord and beyond—no matter what player or platform you use. It supports 29+ media players, browser playback, and all major streaming services, with advanced features for social listening, scrobbling, and more.

---

## Features

- **Works with any media player!**
  - 29+ players supported (native, browser, streaming, etc.)—adding new ones is easy.
- **100% correct album cover**
  - Always shows the right artwork, no external sources needed.
- **Fine-grained control**
  - Choose which apps are shared, customize status per player, override settings individually.
- **Spotify synergy & podcast support**
  - Works with official Spotify integration, shows podcasts, lets you choose what's shared.
- **Dynamic tray icon**
  - Tray icon changes to reflect current state (active, paused, waiting, disabled).
- **Accurate playback position**
  - Shows real-time elapsed/remaining time if supported by the player.
- **Customizable activity name**
  - Switch between "Music" or the player name in your status with one click.
- **Paused/offline media handling**
  - Show paused status or custom icon for offline players.
- **Unified controls**
  - One app for all your music presence needs—no more separate plugins.
- **In-app & automatic updates**
  - Seamless updates, with changelog popups after each update.
- **TIDAL/Deezer enhancements**
  - "Listen to this song" button, shows all artists (not just the main one).
- **Listen Along**
  - Sync playback with friends or groups, join sessions, or let others follow your music in real time.
- **Multi-platform song links**
  - Share a button in your status with links to the song on all major platforms (Spotify, TIDAL, Apple Music, YouTube, etc.).
- **Integrations for real-time streaming**
  - Public API/WebSocket for third-party platforms to receive your playback data.
- **Modern windowed UI**
  - Full-featured dashboard for settings, friends, integrations, and more.
- **Scrobbling support**
  - Native integration with last.fm, ListenBrainz, and libre.fm.
- **Browser media support**
  - Custom browser extension for Chrome/Firefox/Edge to detect and share browser playback.
- **Linux support**
  - Native MPRIS integration, AppImage/deb/rpm builds.

---

## Installation & Download

### **Download**
- Visit the [Releases page](https://github.com/jrftw/InfinitumMusicPresence/releases) to download the latest installer for your platform:
  - **macOS:** `.dmg` or `.zip`
  - **Windows:** `.exe` (NSIS installer or portable)
  - **Linux:** `.AppImage`, `.deb`, or `.rpm`

### **Build from Source**
1. Clone the repository:
   ```bash
   git clone https://github.com/jrftw/InfinitumMusicPresence.git
   cd InfinitumMusicPresence
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build and package:
   ```bash
   npm run build
   npm run dist
   ```
4. Find installers in the `dist/` directory.

---

## Usage
- Launch the app. The tray icon will appear and reflect the current state.
- Open the main window for a full dashboard and settings.
- Play music in any supported player or browser—your Discord status will update automatically.
- Use the Listen Along feature to sync playback with friends.
- Share multi-platform song links directly from your status.
- Enable scrobbling and integrations in the settings.

---

## Roadmap & Completed Milestones
- [x] Windowed UI/dashboard (Electron + React)
- [x] Listen Along backend & sync (WebSocket, group sessions)
- [x] Multi-platform song links (Odesli/Songlink integration)
- [x] Linux support (MPRIS, AppImage/deb/rpm)
- [x] 29+ player support (modular, easy to add new players)
- [x] Album art extraction for all players
- [x] Per-player settings and overrides
- [x] Spotify synergy & podcast support
- [x] Dynamic tray icon
- [x] Accurate playback position
- [x] Activity name customization
- [x] Paused/offline handling
- [x] Unified controls
- [x] In-app/auto updates
- [x] TIDAL/Deezer enhancements
- [x] Scrobbling (last.fm, ListenBrainz, libre.fm)
- [x] Browser extension (Chrome/Firefox/Edge)
- [x] Public API for integrations

---

## Disclaimer

This software is **not** affiliated with or endorsed by Discord.
This software is **not** affiliated with or endorsed by any streaming service, media player, or company that distributes music, including but not limited to those displayed within the Music Presence app.

---

## Contributing

Pull requests and feature suggestions are welcome! Please see the [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## License

MIT License 