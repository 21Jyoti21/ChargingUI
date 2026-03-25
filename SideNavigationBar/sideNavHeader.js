class SideNavHeader {
    constructor(options = {}) {
        this.title = options.title || "Drivool uMove";
        this.version = options.version || "Version 1.15.5";

        this._createUI();
    }
    _createUI() {
        this.el = document.createElement("div");
        this.el.className = "side-header";

        this.el.innerHTML = `
            <div class="header-row">
                <div class="profile-icon">
                    <span class="material-icons user">person</span>
                    <span class="material-icons badge">settings</span>
                </div>
                <div class="header-text">
                    <div class="title">${this.title}</div>
                    <div class="version">${this.version}</div>
                </div>
            </div>
        `;
        this.titleEl = this.el.querySelector(".title");
    }
    getElement() {
        return this.el;
    }
    setHeader(text) {
        this.titleEl.innerHTML = text;
    }
}