const siyuan = require("siyuan");
const File = 'config.json';
const DefaultConfig = {
    themeColor: '#3b82f6' 
};
let colorInput;
class Plugin extends siyuan.Plugin {
    constructor() {
        super(...arguments);
    }
    async onload() {
        this.config = await this.loadData(File) || DefaultConfig;
        const themeColor = this.config.themeColor;
        this.setThemeColor(themeColor);
    }
    onLayoutReady() {
        if (window.siyuan.isPublish) return;
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
        colorInput?.remove();
        colorInput = document.createElement('input');
        colorInput.type = 'color';
        colorInput.className = 'QYL-CustomThemeColor-input';
        Object.assign(colorInput.style, {
            position: 'fixed',
            top: '32px',
            right: '450px',
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
        const currentColor = this.config.themeColor;
        colorInput.value = currentColor;
        document.body.appendChild(colorInput);
        setTimeout(() => {
            colorInput.click();
        }, 10);
        colorInput.addEventListener('change', (e) => {
            const selectedColor = e.target.value;
            this.applyThemeColor(selectedColor);
            colorInput?.remove();
        });
        const closeHandler = (e) => {
            if (!colorInput.contains(e.target)) {
                document.removeEventListener('click', closeHandler, true);
                colorInput?.remove();
            }
        };
        setTimeout(() => {
            document.addEventListener('click', closeHandler, true); // 有的 click 事件会被阻止冒泡导致监听不到，需在捕获阶段监听
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
        colorInput?.remove();
        document.documentElement.style.removeProperty('--QYL-CustomThemeColor');
    }
    async uninstall() {
        colorInput?.remove();
        document.documentElement.style.removeProperty('--QYL-CustomThemeColor');
        await this.removeData(File);
    }
}
module.exports = Plugin;
