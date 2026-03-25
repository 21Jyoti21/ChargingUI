class SideNavigationBar {
    constructor(container, options = {}) {
        this.container = container;

        this.headerOptions = options.header || {};
        this.menuItems = options.menuItems || [];
        this._createUI();
    }
    _createUI() {
        this.sidebar = document.createElement("div");
        this.sidebar.className = "side-nav visible";

        //creating header seperate
        this.header = new SideNavHeader(this.headerOptions);

        //creating menu separate
        this.menu = new SideNavMenu(this.menuItems);

        this.sidebar.appendChild(this.header.getElement());
        this.sidebar.appendChild(this.menu.getElement());
        this.container.appendChild(this.sidebar);
    }
    show() {
        this.sidebar.classList.remove("hidden");
        this.sidebar.classList.add("visible");
    }
    hide() {
        this.sidebar.classList.remove("visible");
        this.sidebar.classList.add("hidden");
    }
    setHeader(htmlText) {
        this.header.setHeader(htmlText);
    }
    setMenu(joMenu, onClickCallback) {
        this.menu.setMenu(joMenu,onClickCallback);
    }
}