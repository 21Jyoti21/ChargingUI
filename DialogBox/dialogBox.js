class DialogBox {
    constructor(container,options = {}) {
        this.container = container; 
        this.title = options.title || "Dialog Box Title";
        this.content = options.content || "Some inner content...";
        this.onClose = options.onClose || function () {};

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
    show() {
        this.overlay.classList.remove("hidden");
        this.overlay.classList.add("visible");

        setTimeout(() => {
            this.dialog.classList.add("open");
        }, 5)
    }
    hide() {
        this.dialog.classList.remove("open");
        setTimeout(() => {
            this.overlay.classList.remove("visible");
            this.overlay.classList.add("hidden");
        }, 5);
    }
    setContent(content) {
        this.body.innerHTML = content;
    }
    setTitle(title) {
        this.titleEl.innerText = title;
    }
}