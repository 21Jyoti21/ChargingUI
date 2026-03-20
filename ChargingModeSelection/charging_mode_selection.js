class ConfigPanel{
    constructor(container, tabLabels = [], callback = () => {}){
        this.container = container;
        this.tabs = ["full", "time", "units"];
        this.labels = tabLabels;
        this.callback = callback;

        this.activeMode = "full";
        this.time = 60;
        this.units = 10;

        this._createUI();
    }
    _createUI(){
        this.configPanel=document.createElement("div");
        this.configPanel.className="config-panel";

        const tabs = this._createTabs();

        this.content = this._createElement("div", "config-content");

        this.full = this._createFullCharge();
        this.timeUI = this._createTimeSlider();
        this.unitsUI = this._createUnitSlider();

        this.content.append(this.full, this.timeUI, this.unitsUI);

        this.configPanel.append(tabs, this.content);
        this.container.appendChild(this.configPanel);

    }
    _createElement(tag, className, text = "") {
        const el = document.createElement(tag);
        if (className) el.className = className;
        if (text) el.innerText = text;
        return el;
    }
    _createTabs() {
        this.tabsWrapper = this._createElement("div", "config-tabs");
        this.tabButtons = [];

        this.tabs.forEach((mode, index) => {
            const btn = this._createElement(
            "button",
            "config-tab" + (index === 0 ? " active" : ""),
            this.labels[index]
            );

            btn.dataset.mode = mode;

            btn.addEventListener("click", () => {
            this._onTabChange(mode, btn);
            });

            this.tabsWrapper.appendChild(btn);
            this.tabButtons.push(btn);
        });

        return this.tabsWrapper;
    }
    _createFullCharge() {
        const wrapper = this._createElement("div", "config-mode-content active");
        wrapper.id = "fullChargeMode";

        const card = this._createElement("div", "mode-card");

        const icon = this._createElement("div", "mode-icon", "🔋");
        const title = this._createElement("div", "mode-title", "FULL CHARGE");
        const sub = this._createElement("div", "mode-subtitle", "Charge to 100% capacity");

        card.append(icon, title, sub);
        wrapper.appendChild(card);

        return wrapper;
    }
    _createTimeSlider() {
        const wrapper = this._createElement("div", "config-mode-content");
        wrapper.id = "setTimeMode";

        const section = this._createElement("div", "mode-card slider-section");
        const header = this._createElement("div", "slider-header");

        const minus = this._createElement("button", "slider-btn", "-");
        const plus = this._createElement("button", "slider-btn", "+");

        const valueBox = this._createElement("div", "slider-value");
        this.timeText = this._createElement("span", "", this.time);
        this.unit = this._createElement("span", "unit", ":00");

        valueBox.append(this.timeText, this.unit);
        header.append(minus, valueBox, plus);

        const track = this._createElement("div", "slider-track");
        this.progressTime = this._createElement("div", "slider-progress");
        this.thumbTime = this._createElement("div", "slider-thumb");
        
        track.append(this.progressTime, this.thumbTime);
        this._enableDrag(track, this.thumbTime, (percent) => {
            const maxMinutes = 48 * 60;
            this.time = Math.round(percent * maxMinutes / 5) * 5;

            this._updateTimeUI();
            this._emit();
        });

        this.infoTime = this._createElement("div", "slider-info");

        this.energyText = this._createElement("span", "", "0");
        this.stopTimeText = this._createElement("span", "", "0 hour, 00 min");

        this.infoTime.innerHTML = `
            Estimated energy gain: ~ <span>0</span> KWh<br>
            Charging will stop at <span>0 hour, 00 min</span>
        `;

        minus.onclick = () => {
            this.time = Math.max(5, this.time - 5);
            this._updateTimeUI();
            this._emit();
        };

        plus.onclick = () => {
            this.time += 5;
            this._updateTimeUI();
            this._emit();
        };
        this._updateTimeUI();
        section.append(header, track, this.infoTime);
        wrapper.appendChild(section);

        return wrapper;
    }
    _createUnitSlider() {
        const wrapper = this._createElement("div", "config-mode-content");
        wrapper.id = "setUnitsMode";

        const section = this._createElement("div", "mode-card slider-section");
        const header = this._createElement("div", "slider-header");

        const minus = this._createElement("button", "slider-btn", "-");
        const plus = this._createElement("button", "slider-btn", "+");

        const valueBox = this._createElement("div", "slider-value");
        this.unitText = this._createElement("span", "", this.units);
        const unit = this._createElement("span", "unit", "KWh");

        valueBox.append(this.unitText, unit);
        header.append(minus, valueBox, plus);

        const track = this._createElement("div", "slider-track");
        this.progressUnit = this._createElement("div", "slider-progress");
        this.thumbUnit = this._createElement("div", "slider-thumb");
        track.append(this.progressUnit, this.thumbUnit);

        this._enableDrag(track, this.thumbUnit, (percent) => {
            const maxKwh = 100;
            this.units = Math.round(percent * maxKwh);

            this._updateUnitUI();
            this._emit();
        });

        this.infoUnit = this._createElement("div", "slider-info");
        this.infoUnit.innerHTML = `
            Estimated duration: ~ <span>0</span> hours<br>
            Charging will stop at <span>0 KWh</span>
        `;
        minus.onclick = () => {
            this.units = Math.max(1, this.units - 1);
            this._updateUnitUI();
            this._emit();
        };

        plus.onclick = () => {
            this.units += 1;
            this._updateUnitUI();
            this._emit();
        };

        section.append(header, track, this.infoUnit);
        wrapper.appendChild(section);
        this._updateUnitUI();
        return wrapper;
    }
    _onTabChange(mode, btn) {
        this.activeMode = mode;

        this.tabButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        this.full.classList.remove("active");
        this.timeUI.classList.remove("active");
        this.unitsUI.classList.remove("active");

        if (mode === "full") this.full.classList.add("active");
        if (mode === "time") this.timeUI.classList.add("active");
        if (mode === "units") this.unitsUI.classList.add("active");

        this._emit();
    }
    _emit() {
        let value = null;

        if (this.activeMode === "time") value = this.time;
        if (this.activeMode === "units") value = this.units;

        this.callback({
            mode: this.activeMode,
            value
        });
    }
    _updateTimeUI() {
        const hours = Math.floor(this.time / 60);
        const mins = this.time % 60;

        this.timeText.innerText = hours;
        this.unit.innerText = ":" + mins.toString().padStart(2, "0");

        const maxMinutes = 48 * 60;
        const percent = (this.time / maxMinutes) * 100;

        this.progressTime.style.width = percent + "%";
        this.thumbTime.style.left = percent + "%";

        const energy = Math.round((this.time / 60) * 3);

        this.infoTime.innerHTML = `
            Estimated energy gain: ~ ${energy} KWh<br>
            Charging will stop at ${hours} hour, ${mins.toString().padStart(2, "0")} min
        `;
    }
    _updateUnitUI() {
        this.unitText.innerText = this.units;

        const maxKwh = 100;
        const percent = (this.units / maxKwh) * 100;

        this.progressUnit.style.width = percent + "%";
        this.thumbUnit.style.left = percent + "%";

        const estimatedHours = Math.round(this.units / 3);

        this.infoUnit.innerHTML = `
            Estimated duration: ~ ${estimatedHours} hours<br>
            Charging will stop at ${this.units} KWh
        `;
    }
    _enableDrag(track, thumb, updateCallback) {
        const onMove = (clientX) => {
            const rect = track.getBoundingClientRect();
            let percent = (clientX - rect.left) / rect.width;

            percent = Math.max(0, Math.min(1, percent));

            updateCallback(percent);
        };

        const onMouseMove = (e) => onMove(e.clientX);
        const onTouchMove = (e) => onMove(e.touches[0].clientX);

        const stop = () => {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", stop);
            document.removeEventListener("touchmove", onTouchMove);
            document.removeEventListener("touchend", stop);
        };

        thumb.addEventListener("mousedown", () => {
            document.addEventListener("mousemove", onMouseMove);
            document.addEventListener("mouseup", stop);
        });

        thumb.addEventListener("touchstart", () => {
            document.addEventListener("touchmove", onTouchMove);
            document.addEventListener("touchend", stop);
        });

        track.addEventListener("click", (e) => {
            onMove(e.clientX);
        });
    }
}