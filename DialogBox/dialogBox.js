class DialogBox {
    constructor(container,options = {}) {
        this.container = container; 
        this.title = options.title || "Dialog Box Title";
        this.content = options.content || "Some inner content...";
        
        this.defaultTitle = this.title;
        this.defaultContent = this.content;

        this.onClose = options.onClose || function () {};
        this.isLocked = false;
        this._createUI();
    }
    _createUI() {
        //This is overlay
        this.overlay = document.createElement("div");
        this.overlay.className = "overlay hidden";

        //this is Dialog container
        this.dialog = document.createElement("div");
        this.dialog.className = "dialog-box hidden";

        this.header = document.createElement("div");
        this.header.className = "dialog-header";

        this.titleEl = document.createElement("span");
        this.titleEl.innerText = this.title;

        this.closeBtn = document.createElement("button");
        this.closeBtn.className = "dialog-close";
        this.closeBtn.innerText = "✖";

        this.header.appendChild(this.titleEl);
        this.header.appendChild(this.closeBtn);

        this.body = document.createElement("div");
        this.body.className = "dialog-body";
        this.body.innerHTML = this.content;

        this.dialog.appendChild(this.header);
        this.dialog.appendChild(this.body);
        
        this.overlay.appendChild(this.dialog);
        this.container.appendChild(this.overlay);
        this.overlay.addEventListener("click", (e) => {
            if (e.target === this.overlay) {
                this.hide();
            }
        });
        this.closeBtn.addEventListener("click", (e) => {
            if (e.target === this.closeBtn) {
                this.hide();
            }
        });
    }
    resetToDefault() {
         if (this.isLocked) {
            return;
        }
        this.dialog.classList.remove("small");
        this.setTitle(this.defaultTitle);
        this.setContent(this.defaultContent);
    }
    show() {
        this._runIfAllowed(() => {
            
            this.overlay.classList.remove("hidden");
            this.overlay.classList.add("visible");
            //adding animation for dialog box
            this.dialog.classList.remove("closing");
            setTimeout(() => {
                this.dialog.classList.add("open");
            }, 5);
        });
    }
    hide() {
        this._runIfAllowed(() => {
            this.dialog.classList.remove("open");
            this.dialog.classList.add("closing");

            setTimeout(() => {
                this.overlay.classList.remove("visible");
                this.overlay.classList.add("hidden");
                //adding animation for dialog box
                this.dialog.classList.remove("closing");
            }, 5);
        });
    }
    setContent(content) {
        this.body.innerHTML = content;
    }
    setTitle(title) {
        this.titleEl.innerText = title;
    }
    showYesNoDialog(options, callback) {
        this._runIfAllowed(() => {
            this.setSize("small");
            const { icon, title, message } = options;
            
            this.setTitle(title || "Confirmation");
            
            this.setContent(`
                <div style="text-align:center">
                ${icon ? `<img src="${icon}" style="width:40px;margin-bottom:10px;">` : ""}
                <p>${message || "Are you sure?"}</p>
                <div style="margin-top:15px">
                <button id="yesBtn">YES</button>
                <button id="noBtn">NO</button>
                </div>
                </div>
                `);
                
            this.show();
            setTimeout(() => {
                this.body.querySelector("#yesBtn").onclick = () => {
                    this.hide();
                    callback(true);
                };
                
                this.body.querySelector("#noBtn").onclick = () => {
                    this.hide();
                    callback(false);
                };
            }, 10);
        });                                
    }
    showTransientMessage(message, duration = 2000) {
        this._runIfAllowed(() => {
            this.setTitle("Message");
            
            this.setContent(`
                <div style="text-align:center">
                <p>${message}</p>
                </div>
                `);
                
                this.show();
                
                setTimeout(() => {
                    this.hide();
                }, duration);
        });
    }
    showStayMessage(message) {
        this.setSize("small");
        this.setTitle("Message");
        
        this.setContent(`
            <div class="stay-container">
                <div class="stay-message">
                    <p>${message}</p>
                </div>

                <div class="stay-footer">
                    <button id="okBtn">OK</button>
                </div>
            </div>
        `);
            
        this.show();
            
        this.isLocked = true;
        setTimeout(() => {
            this.body.querySelector("#okBtn").onclick = () => {
                this.isLocked = false;
                this.hide();
            };
        }, 10);
    }
    //this is kept as guard for stay message dialog box
    _runIfAllowed(fn) {
        if (this.isLocked) {
            alert("Please click OK to close this message");
            return;
        }
        fn();
    }
    showMenu(menuItems, callback) {
        this._runIfAllowed(() => {
            this.setTitle("Menu");
            //here generating menu HTML
            const menuHtml = menuItems.map(item => `
                <div class="menu-item" data-id="${item.id}">
                    ${item.label}
                </div>
            `).join("");
            this.setContent(`
                <div class="menu-container">
                    ${menuHtml}
                </div>
            `);
            this.show();
            setTimeout(() => {
                const items = this.body.querySelectorAll(".menu-item");

                items.forEach(el => {
                    el.onclick = () => {
                        const id = el.getAttribute("data-id");
                        this.hide();
                        callback(id);
                    };
                });
            }, 10);
        });
    }
    setSize(size) {
        this.dialog.classList.remove("small");

        if (size === "small") {
            this.dialog.classList.add("small");
        }
    }
}