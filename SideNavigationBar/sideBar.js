class SideNavigationBar {
    constructor(container, options = {}) {
        this.container = container;

        this.headerOptions = options.header || {};
        this.menuItems = options.menuItems || [];
        this._createUI();
    }
    _createUI() {
        this.overlay = document.createElement("div");
        this.overlay.className = "overlay hidden";

        this.sidebar = document.createElement("div");
        this.sidebar.className = "side-nav visible";

        //creating header seperate
        this.header = new SideNavHeader(this.headerOptions);

        //creating menu separate
        this.menu = new SideNavMenu(this.menuItems);

        this.sidebar.appendChild(this.header.getElement());
        this.sidebar.appendChild(this.menu.getElement());

        this.overlay.appendChild(this.sidebar);
        this.container.appendChild(this.overlay);
        this.overlay.addEventListener("click", (e) => {
            if (e.target === this.overlay) {
                this.hide();
            }
        });
    }
    show() {
        this.overlay.classList.remove("hidden");
        this.overlay.classList.add("visible");

        setTimeout(() => {
            this.sidebar.classList.add("open");
        }, 10)
    }
    hide() {
        this.sidebar.classList.remove("open");
        setTimeout(() => {
            this.overlay.classList.remove("visible");
            this.overlay.classList.add("hidden");
        }, 300);
    }
    setHeader(htmlText) {
        this.header.setHeader(htmlText);
    }
    setMenu(joMenu, onClickCallback) {
        this.menu.setMenu(joMenu,onClickCallback);
    }
}