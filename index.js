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
        const existingPicker = document.querySelector('.QYL-CustomThemeColor-input');
        if (existingPicker) {
            document.body.removeChild(existingPicker);
        }
        const colorInput = document.createElement('input');
        colorInput.type = 'color';
        colorInput.className = 'QYL-CustomThemeColor-input';
        Object.assign(colorInput.style, {
            position: 'fixed',
            top: '50vh',
            left: '50vw',
            transform: 'translate(-50%, -50%)',
            zIndex: '9999',
            opacity: '0',
            pointerEvents: 'none',
            width: '1px',
            height: '1px',
            border: 'none',
            outline: 'none',
            margin: '0',
            padding: '0'
        });
        const currentColor = this.config.themeColor || '#3575f0';
        colorInput.value = currentColor;
        document.body.appendChild(colorInput);
        setTimeout(() => {
            colorInput.click();
        }, 10);
        colorInput.addEventListener('change', (e) => {
            const selectedColor = e.target.value;
            this.applyThemeColor(selectedColor);
            if (colorInput.parentNode) {
                document.body.removeChild(colorInput);
            }
        });
        const closeHandler = (e) => {
            if (!colorInput.contains(e.target)) {
                if (colorInput.parentNode) {
                    document.body.removeChild(colorInput);
                }
                document.removeEventListener('click', closeHandler);
            }
        };
        setTimeout(() => {
            document.addEventListener('click', closeHandler);
        }, 100);
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
        const existingPicker = document.querySelector('.QYL-CustomThemeColor-input');
        if (existingPicker) {
            document.body.removeChild(existingPicker);
        }
        document.documentElement.style.removeProperty('--QYL-CustomThemeColor');
    }
    async uninstall() {
        const existingPicker = document.querySelector('.QYL-CustomThemeColor-input');
        if (existingPicker) {
            document.body.removeChild(existingPicker);
        }
        document.documentElement.style.removeProperty('--QYL-CustomThemeColor');
        await this.removeData(File);
    }
}
module.exports = Plugin;
