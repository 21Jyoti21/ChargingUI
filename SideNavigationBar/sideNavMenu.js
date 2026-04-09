class SideNavMenu {
    constructor(menuItems = []) {
        this.menuItems = menuItems.length ? menuItems : this._defaultItems();
        this._createUI();
    }
    _defaultItems() {
        return [
            { icon: "person", tag: "Change Account", id: "change_account" },
            { icon: "sync", tag: "Manage Accounts", id: "manage_accounts" },
            { icon: "power_settings_new", tag: "Manage Devices", id: "devices" },
            { divider: true },
            { icon: "credit_card", tag: "SIM Recharge", id: "sim_recharge" },
            { icon: "place", tag: "GPS Recharge", id: "gps_recharge" },
            { icon: "shopping_cart", tag: "Drivool Shop", id: "shop" },
            { divider: true },
            { icon: "help_outline", tag: "Help", id: "help" },
            { icon: "info", tag: "About", id: "about" }
        ];
    }
    _createUI() {
        this.el = document.createElement("div");
        this.el.className = "side-menu";

        this.menuItems.forEach(item => {
            if (item.divider) {
                const divider = document.createElement("div");
                divider.className = "divider";
                this.el.appendChild(divider);
            } else {
                const row = document.createElement("div");
                row.className = "menu-item";

                row.innerHTML = `
                    <span class="material-icons icon">${item.icon}</span>
                    <span class="text">${item.tag}</span>
                `;
                this.el.appendChild(row);
            }
        });
    }
    getElement() {
        return this.el;
    }
    setMenu(joMenu, onClickCallback) {
        this.el.innerHTML = "";
        this.onMenuClick = onClickCallback;

        joMenu.forEach(item => {
            if(item.divider){
                const divider = document.createElement("div");
                divider.className = "divider";
                this.el.appendChild(divider);
                return;
            }
            const row = document.createElement("div");
            row.className = "menu-item";
            row.innerHTML = `
                <span class="material-icons icon">${item.icon}</span>
                <span class="text">${item.tag}</span>
            `;
            row.onclick = () => {
                if (this.onMenuClick) {
                    this.onMenuClick(item.id);
                }
            };
            this.el.appendChild(row);
        });
    }
}