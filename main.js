const { Plugin, PluginSettingTab, Setting } = require('obsidian');

const DEFAULT_SETTINGS = {
  imagePath: 'images/wallpaper.jpg',
  dim: 0.42,
  panelOpacity: 0.62,
  sideOpacity: 0.84,
  radius: 10,
};

module.exports = class WallpaperBgPlugin extends Plugin {
  async onload() {
    await this.loadSettings();

    this.styleEl = document.createElement('style');
    this.styleEl.id = 'wallpaper-bg-style';
    document.head.appendChild(this.styleEl);

    this.applyStyle();

    // The vault index may not be ready when onload runs, so apply again
    // once the workspace layout is ready; this fixes the wallpaper not
    // showing on a fresh Obsidian start.
    this.app.workspace.onLayoutReady(() => {
      this.applyStyle();
    });

    this.registerEvent(
      this.app.vault.on('modify', (file) => {
        if (file.path === this.settings.imagePath) this.applyStyle();
      })
    );

    this.registerEvent(
      this.app.vault.on('rename', (file, oldPath) => {
        if (oldPath === this.settings.imagePath) {
          this.settings.imagePath = file.path;
          this.saveSettings();
          this.applyStyle();
        }
      })
    );

    this.addSettingTab(new WallpaperBgSettingTab(this.app, this));
  }

  onunload() {
    if (this.styleEl) this.styleEl.remove();
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  applyStyle() {
    if (!this.styleEl) return;

    const s = this.settings;
    const file = this.app.vault.getAbstractFileByPath(s.imagePath);
    const url = file ? this.app.vault.adapter.getResourcePath(s.imagePath) : '';

    const titlebarBg = 'transparent';
    const titlebarBorder = 'var(--wp-line)';

    const bg = url
      ? [
          'background-image:',
          '  linear-gradient(rgba(var(--wp-mask-rgb), var(--wp-dim)), rgba(var(--wp-mask-rgb), var(--wp-dim))),',
          '  url("' + url + '") !important;',
          'background-size: cover, cover !important;',
          'background-position: center center, center center !important;',
          'background-attachment: fixed, fixed !important;',
          'background-repeat: no-repeat, no-repeat !important;',
          'background-color: transparent !important;',
        ].join('\n')
      : '';

    const css = [
      'body {',
      '  --titlebar-background: ' + titlebarBg + ' !important;',
      '  --titlebar-background-focused: ' + titlebarBg + ' !important;',
      '  --tab-container-background: ' + titlebarBg + ' !important;',
      '  --titlebar-text-color: var(--text-normal) !important;',
      '  --titlebar-text-color-focused: var(--text-normal) !important;',
      '  --wp-dim: ' + s.dim + ';',
      '  --wp-panel: ' + s.panelOpacity + ';',
      '  --wp-side: ' + s.sideOpacity + ';',
      '  --wp-radius: ' + s.radius + 'px;',
      '}',
      'body.theme-dark {',
      '  --wp-panel-rgb: 18, 18, 20;',
      '  --wp-mask-rgb: 0, 0, 0;',
      '  --wp-titlebar-shade: rgba(0, 0, 0, 0.28);',
      '  --wp-line: rgba(255, 255, 255, 0.07);',
      '}',
      'body.theme-light {',
      '  --wp-panel-rgb: 250, 250, 252;',
      '  --wp-mask-rgb: 255, 255, 255;',
      '  --wp-titlebar-shade: rgba(255, 255, 255, 0.30);',
      '  --wp-line: rgba(0, 0, 0, 0.08);',
      '}',
      'body, .app-container {',
      bg,
      '}',
      '.workspace, .workspace-split, .workspace-leaf,',
      '.workspace-leaf-content, .view-content, .markdown-reading-view,',
      '.markdown-source-view.mod-cm6 .cm-scroller, .workspace-ribbon,',
      '.status-bar, .sidebar-toggle-button {',
      '  background-color: transparent !important;',
      '  box-shadow: none !important;',
      '}',
      '.titlebar {',
      '  background: linear-gradient(180deg, var(--wp-titlebar-shade), transparent) !important;',
      '  border-bottom: 1px solid ' + titlebarBorder + ' !important;',
      '  box-shadow: none !important;',
      '}',
      '.titlebar-inner {',
      '  background: transparent !important;',
      '}',
      '.workspace-ribbon {',
      '  background-color: rgba(var(--wp-panel-rgb), 0.25) !important;',
      '}',
      '.titlebar-text, .titlebar-text.mod-mac, .titlebar-button {',
      '  color: var(--text-normal) !important;',
      '}',
      '.workspace-tabs, .workspace-tab-header-container,',
      '.workspace-tab-header-container-inner {',
      '  background-color: transparent !important;',
      '  box-shadow: none !important;',
      '}',
      '.markdown-reading-view, .markdown-source-view.mod-cm6 .cm-scroller {',
      '  background-color: rgba(var(--wp-panel-rgb), var(--wp-panel)) !important;',
      '  border-radius: var(--wp-radius) !important;',
      '  backdrop-filter: none !important;',
      '}',
      '.workspace-split.mod-left-split, .workspace-split.mod-right-split {',
      '  background-color: rgba(var(--wp-panel-rgb), var(--wp-side)) !important;',
      '  backdrop-filter: none !important;',
      '}',
      '.workspace-split.mod-left-split { border-right: 1px solid var(--wp-line); }',
      '.workspace-split.mod-right-split { border-left: 1px solid var(--wp-line); }',
      '.document-search-container {',
      '  background-color: rgba(var(--wp-panel-rgb), 0.90) !important;',
      '  border-radius: var(--wp-radius) !important;',
      '  backdrop-filter: none !important;',
      '}',
      '.document-search-container .search-input-container,',
      '.document-search-container .search-input-container input {',
      '  background-color: rgba(var(--wp-panel-rgb), 0.65) !important;',
      '  border: 1px solid var(--wp-line) !important;',
      '  box-shadow: none !important;',
      '  color: var(--text-normal) !important;',
      '}',
      '.document-search-container .clickable-icon,',
      '.document-search-container button,',
      '.document-search-container .search-input-clear-button {',
      '  --icon-color: var(--text-normal) !important;',
      '  color: var(--text-normal) !important;',
      '  opacity: 1 !important;',
      '}',
    ].join('\n');

    this.styleEl.textContent = css;
  }
};

class WallpaperBgSettingTab extends PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display() {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl('h2', { text: 'Wallpaper Background' });

    new Setting(containerEl)
      .setName('Image path (vault-relative)')
      .setDesc('For example: images/wallpaper.jpg')
      .addText((text) =>
        text
          .setPlaceholder('images/wallpaper.jpg')
          .setValue(this.plugin.settings.imagePath)
          .onChange(async (value) => {
            this.plugin.settings.imagePath = value.trim();
            await this.plugin.saveSettings();
            this.plugin.applyStyle();
          })
      );

    new Setting(containerEl)
      .setName('Wallpaper dim')
      .setDesc('0 = original brightness, 1 = fully covered')
      .addSlider((slider) =>
        slider
          .setLimits(0, 1, 0.01)
          .setValue(this.plugin.settings.dim)
          .setDynamicTooltip()
          .onChange(async (value) => {
            this.plugin.settings.dim = value;
            await this.plugin.saveSettings();
            this.plugin.applyStyle();
          })
      );

    new Setting(containerEl)
      .setName('Note panel opacity')
      .addSlider((slider) =>
        slider
          .setLimits(0, 1, 0.01)
          .setValue(this.plugin.settings.panelOpacity)
          .setDynamicTooltip()
          .onChange(async (value) => {
            this.plugin.settings.panelOpacity = value;
            await this.plugin.saveSettings();
            this.plugin.applyStyle();
          })
      );

    new Setting(containerEl)
      .setName('Sidebar opacity')
      .addSlider((slider) =>
        slider
          .setLimits(0, 1, 0.01)
          .setValue(this.plugin.settings.sideOpacity)
          .setDynamicTooltip()
          .onChange(async (value) => {
            this.plugin.settings.sideOpacity = value;
            await this.plugin.saveSettings();
            this.plugin.applyStyle();
          })
      );

    new Setting(containerEl)
      .setName('Panel corner radius (px)')
      .addSlider((slider) =>
        slider
          .setLimits(0, 24, 1)
          .setValue(this.plugin.settings.radius)
          .setDynamicTooltip()
          .onChange(async (value) => {
            this.plugin.settings.radius = value;
            await this.plugin.saveSettings();
            this.plugin.applyStyle();
          })
      );
  }
}
