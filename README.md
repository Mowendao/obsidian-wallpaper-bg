# Wallpaper Background for Obsidian

Use an image from your vault as the Obsidian window background, with an adjustable dim layer and per-panel opacity.

![Obsidian](https://img.shields.io/badge/Obsidian-1.0%2B-7C3AED)

## Features

- Full-window wallpaper from any image in your vault
- Dim layer so text stays readable
- Separate opacity for note panel and sidebars
- Sidebars are translucent **without** blur (no frosted-glass look)
- Re-renders automatically when the image file changes

## Install (manual)

1. Download `main.js` and `manifest.json` from the latest release (or clone this repo).
2. Put both files into `<your-vault>/.obsidian/plugins/wallpaper-bg/`.
3. Open **Settings → Community plugins**, enable **Wallpaper Background**.
4. Open the plugin settings and set the image path, e.g. `images/wallpaper.jpg`.

Desktop only.

## Settings

| Setting | Range | Description |
| --- | --- | --- |
| Image path | vault-relative path | e.g. `images/wallpaper.jpg` |
| Wallpaper dim | 0–1 | 0 = original brightness, 1 = fully covered |
| Note panel opacity | 0–1 | background opacity of the note area |
| Sidebar opacity | 0–1 | background opacity of left/right sidebars |
| Panel corner radius | 0–24 px | rounded corners of the note area |

## How it works

The plugin resolves the image with Obsidian's `vault.adapter.getResourcePath()` and injects a `<style>` element. Because it uses the official resource URL, no base64 embedding or CSS-snippet path tricks are needed — replacing the image file is enough.

## License

MIT © Mowendao
