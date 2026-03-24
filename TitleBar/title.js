class TitleBar{
    constructor(container,options={}){
        this.container=container;
        this.config = options;

        //if not using configure api then this is the way:
        // this.titleText=options.titleText || "Vehicles Admin";
        // this.backgColor=options.backgColor||"#2f4a7c";
        // this.profileImg = options.profileImg || "pic.jpg";

        this._createUI();
        this.configure(this.config);
    }
    //exposing one api
    configure(config = {}) {
        this.config = { ...this.config, ...config };

        if (config.titleText) {
            this.title.innerText = config.titleText;
        }

        if (config.backgColor) {
            this.titleBar.style.backgroundColor = config.backgColor;
        }

        if (config.profileImg) {
            this.profile.src = config.profileImg;
        }
    }
    _createUI(){
        this.titleBar = document.createElement("div");
        this.titleBar.className = "title-bar";

        this.titleBar.style.backgroundColor = this.backgColor;

        this.leftSection = document.createElement("div");
        this.leftSection.className = "title-left";

        this.logo = document.createElement("div");
        this.logo.className = "title-logo";

        this.title = document.createElement("div");
        this.title.className = "title-text";
        this.title.innerText = this.titleText;

        this.leftSection.appendChild(this.logo);
        this.leftSection.appendChild(this.title);

        this.rightSection = document.createElement("div");
        this.rightSection.className = "title-right";

        this.profile = document.createElement("img");
        this.profile.className = "title-profile";
        this.profile.src = this.profileImg;

        this.rightSection.appendChild(this.profile);

        this.titleBar.appendChild(this.leftSection);
        this.titleBar.appendChild(this.rightSection);

        this.container.appendChild(this.titleBar);
    }
}