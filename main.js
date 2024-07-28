const { Plugin, PluginSettingTab, Setting } = require('obsidian');

class CustomTypographyPlugin extends Plugin {
    async onload() {
        console.log('Loading Custom Typography Plugin');
        await this.loadSettings();
        this.addSettingTab(new CustomTypographySettingTab(this.app, this));
        this.loadStyles();
        this.registerEvent(this.app.workspace.on('resize', this.handleResize.bind(this)));
    }

    onunload() {
        console.log('Unloading Custom Typography Plugin');
        this.removeStyles();
    }

    loadStyles() {
        const styles = {
            munpia: `
                .markdown-preview-view {
                    width: 100%;
                    max-width: 109mm;
                    min-height: 100vh;
                    margin: 0 auto;
                    padding: 8mm 4mm 50mm; 
                    display: flex;
                    justify-content: center;
                    align-items: flex-start;
                }
                .markdown-preview-sizer {
                    width: 100%;
                    height: auto;
                }
                .markdown-preview-sizer > div {
                    width: 100%;
                }
                @media screen and (max-width: 768px) {
                    .markdown-preview-view {
                        padding: 4mm 2mm 25mm;
                    }
                }
            `,
            novelpia: `
                .markdown-preview-view {
                    width: 100%;
                    max-width: 115mm;
                    min-height: 100vh;
                    margin: 0 auto;
                    padding: 5mm 4mm 50mm;
                    display: flex;
                    justify-content: center;
                    align-items: flex-start;
                }
                .markdown-preview-sizer {
                    width: 100%;
                    height: auto;
                }
                .markdown-preview-sizer > div {
                    width: 100%;
                }
                @media screen and (max-width: 768px) {
                    .markdown-preview-view {
                        padding: 3mm 2mm 25mm;
                    }
                }
            `
        };
    
        const style = document.createElement('style');
        style.id = 'custom-typography-style';
        style.textContent = styles[this.settings.selectedStyle];
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

    handleResize() {
        this.removeStyles();
        this.loadStyles();
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

        new Setting(containerEl)
            .setName('Select typography style')
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
