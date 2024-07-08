const { Plugin, PluginSettingTab, Setting } = require('obsidian');

class CustomTypographyPlugin extends Plugin {
    async onload() {
        console.log('Loading Custom Typography Plugin');
        await this.loadSettings();
        this.addSettingTab(new CustomTypographySettingTab(this.app, this));
        this.loadStyles();
    }

    onunload() {
        console.log('Unloading Custom Typography Plugin');
        this.removeStyles();
    }

    loadStyles() {
        const novelpia = `
            .markdown-preview-view {
                width: 109mm;
                height: 1188mm;
                margin: 8mm 15.4mm 0mm 15.4mm;
                padding-top: 0mm;
                padding-bottom: 0mm;
            }
        `;

        const munpia = `
            .markdown-preview-view {
                width: 115mm;
                height: 175mm;
                margin: 5mm 14mm 0mm 14mm;
                padding-top: 15mm;
                padding-bottom: 0mm;
            }
        `;

        const style = document.createElement('style');
        style.id = 'custom-typography-style';
        style.textContent = this.settings.selectedStyle === 'munpia' ? munpia : novelpia;
        document.head.appendChild(style);
    }

    removeStyles() {
        const style = document.getElementById('custom-typography-style');
        if (style) {
            style.remove();
        }
    }

    async loadSettings() {
        this.settings = Object.assign({ selectedStyle: 'munpia' }, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }
}

class CustomTypographySettingTab extends PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display() {
        const { containerEl } = this;

        containerEl.empty();
        
        containerEl.createEl('h2', { text: 'Custom Typography Settings' });

        new Setting(containerEl)
            .setName('Select Typography Style')
            .setDesc('Choose the typography style to apply.')
            .addDropdown(dropdown => dropdown
                .addOption('munpia', 'Munpia')
                .addOption('novelpia', 'Novelpia')
                .setValue(this.plugin.settings.selectedStyle)
                .onChange(async (value) => {
                    this.plugin.settings.selectedStyle = value;
                    await this.plugin.saveSettings();
                    this.plugin.removeStyles();
                    this.plugin.loadStyles();
                }));
    }
}

module.exports = CustomTypographyPlugin;
