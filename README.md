# Wallpaper Background for Obsidian

Use a vault image or a local **Wallpaper Engine** wallpaper as the Obsidian window background — including real-time **scene** wallpapers, video and images.

![Obsidian](https://img.shields.io/badge/Obsidian-1.0%2B-7C3AED)

## Features

- **Vault image** background with cover / contain / stretch / tile fit
- **Wallpaper Engine** support: scans Steam Workshop (`431960`) and local `myprojects` / `defaultprojects`
- **Scene wallpapers** render live via [WebWallGL](https://github.com/oneincase/webwallgl) — no need to keep Wallpaper Engine running
- **Video** wallpapers play looped and muted
- Adjustable dim layer, note-panel opacity, sidebar opacity and corner radius
- Sidebars are translucent **without** blur
- Re-renders automatically when the source changes; scene rendering pauses when the window loses focus

## Install (manual)

1. Download `main.js` and `manifest.json` from the latest release (or clone this repo).
2. Put both files into `<your-vault>/.obsidian/plugins/wallpaper-bg/`.
3. Open **Settings → Community plugins**, enable **Wallpaper Background**.
4. Choose the background source in the plugin settings.

Desktop only, Windows / macOS / Linux.

## Settings

| Setting | Description |
| --- | --- |
| Background source | `Vault image` or `Wallpaper Engine` |
| Image path | vault-relative path, e.g. `images/wallpaper.jpg` |
| Wallpaper library | scanned Wallpaper Engine wallpapers, click to apply |
| Wallpaper dim | 0 = original, 1 = fully covered |
| Note panel opacity | background opacity of the note area |
| Sidebar opacity | background opacity of left/right sidebars |
| Panel corner radius | rounded corners of the note area |
| Frame rate cap | 30 / 60 fps for scene rendering |
| Pause on blur | stop scene rendering when the window loses focus |

## How it works

- Vault images use Obsidian's `vault.adapter.getResourcePath()`.
- Wallpaper Engine entries are discovered by reading Steam library folders and each project's `project.json`.
- Scene wallpapers are decoded from `scene.pkg` and rendered by WebWallGL (bundled, MIT) in a full-window WebGL2 canvas.
- If a scene fails to mount, the wallpaper's `preview.jpg` is used as a fallback.

## License

MIT © Mowendao
