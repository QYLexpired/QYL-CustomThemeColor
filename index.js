const siyuan = require("siyuan");
const File = 'config.json';
const DefaultConfig = {
    themeColor: '#3b82f6' 
};
class Plugin extends siyuan.Plugin {
    constructor() {
        super(...arguments);
    }
    async onload() {
        this.config = await this.loadData(File) || DefaultConfig;
        const themeColor = this.config.themeColor || DefaultConfig.themeColor;
        this.setThemeColor(themeColor);
    }
    onLayoutReady() {
        this.addTopBar({
            icon: "iconTheme",
            title: this.i18n.QYLCustomThemeColor,
            position: "right",
            callback: () => {
                this.openColorPicker();
            }
        });
    }
    openColorPicker() {
        const existingPicker = document.querySelector('input[type="color"]');
        if (existingPicker) {
            document.body.removeChild(existingPicker);
        }
        const colorInput = document.createElement('input');
        colorInput.type = 'color';
        colorInput.style.position = 'fixed';
        colorInput.style.top = '20px';
        colorInput.style.right = '20px';
        colorInput.style.zIndex = '9999';
        colorInput.style.opacity = '0';
        colorInput.style.pointerEvents = 'none';
        const currentColor = this.config.themeColor || '#3575f0';
        colorInput.value = currentColor;
        document.body.appendChild(colorInput);
        colorInput.click();
        colorInput.addEventListener('change', (e) => {
            const selectedColor = e.target.value;
            this.applyThemeColor(selectedColor);
            document.body.removeChild(colorInput);
        });
    }
    setThemeColor(color) {
        document.documentElement.style.setProperty('--QYL-CustomThemeColor', color);
    }
    async applyThemeColor(color) {
        this.setThemeColor(color);
        this.config.themeColor = color;
        this.saveData(File, this.config);
    }
    onunload() {
        document.documentElement.style.removeProperty('--QYL-CustomThemeColor');
    }
    uninstall() {
        document.documentElement.style.removeProperty('--QYL-CustomThemeColor');
    }
}
module.exports = Plugin;
