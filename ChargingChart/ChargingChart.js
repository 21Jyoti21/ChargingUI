class ChargingChart {
    constructor(container, options = {}, callback = () => {}) {
        this.container = container;
        this.callback = callback;

        this.tabs = options.tabs || ["Current", "Voltage", "Power"];
        this.tabKeys = ["current", "voltage", "power"];

        this.activeChart = "current";

        this.chartDataPoints = {
            times: [],
            currents: [],
            voltages: [],
            powers: []
        };

        this._createUI();
        this._initChart();
        this._attachEvents();
        this._updateChart();
    }

    // 🧱 UI
    _createUI() {
        this.wrapper = document.createElement("div");
        this.wrapper.className = "chart-section";

        const title = document.createElement("h3");
        title.innerText = "Charging Pattern";

        this.tabHeader = document.createElement("div");
        this.tabHeader.className = "tab-header";

        this.tabButtons = [];

        this.tabs.forEach((label, i) => {
            const btn = document.createElement("button");
            btn.className = "tab-button" + (i === 0 ? " active" : "");
            btn.innerText = label;
            btn.dataset.chart = this.tabKeys[i];

            this.tabHeader.appendChild(btn);
            this.tabButtons.push(btn);
        });

        this.indicator = document.createElement("div");
        this.indicator.className = "tab-indicator";
        this.tabHeader.appendChild(this.indicator);

        this.chartContainer = document.createElement("div");
        this.chartContainer.className = "chart-container";

        this.canvas = document.createElement("canvas");
        this.chartContainer.appendChild(this.canvas);

        this.wrapper.append(title, this.tabHeader, this.chartContainer);
        this.container.appendChild(this.wrapper);
    }

    // 📊 Chart init
    _initChart() {
        const ctx = this.canvas.getContext("2d");

        this.chart = new Chart(ctx, {
            type: "line",
            data: {
                labels: ["Waiting..."],
                datasets: [{
                    data: [0],
                    fill: true,
                    tension: 0.4,
                    borderWidth: 2,
                    pointRadius: 3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        title: { display: true, text: "" }
                    }
                }
            }
        });
    }

    // 🖱 EVENTS
    _attachEvents() {
        this.tabButtons.forEach((btn, index) => {
            btn.addEventListener("click", () => {

                this.tabButtons.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");

                this.activeChart = btn.dataset.chart;

                const width = btn.offsetWidth;
                this.indicator.style.width = width + "px";
                this.indicator.style.left = (index * width) + "px";

                this._updateChart();
                this._emit(); // 🔥 callback on tab change
            });
        });
    }

    // 📥 external data update
    updateData(dataPoints) {
        this.chartDataPoints = dataPoints;
        this._updateChart();
        this._emit(); // 🔥 callback on data update
    }

    // 🔄 chart update
    _updateChart() {
        if (!this.chart) return;

        this.chart.data.labels = this.chartDataPoints.times;

        switch (this.activeChart) {
            case "current":
                this.chart.data.datasets[0].data = this.chartDataPoints.currents;
                this.chart.options.scales.y.title.text = "Current (A)";
                break;

            case "voltage":
                this.chart.data.datasets[0].data = this.chartDataPoints.voltages;
                this.chart.options.scales.y.title.text = "Voltage (V)";
                break;

            case "power":
                this.chart.data.datasets[0].data = this.chartDataPoints.powers;
                this.chart.options.scales.y.title.text = "Power (kW)";
                break;
        }

        this.chart.update();
    }

    // 📤 CALLBACK EMIT (IMPORTANT)
    _emit() {
        this.callback({
            activeTab: this.activeChart,
            data: this.chartDataPoints
        });
    }
    setMeterData(joMeterData) {
        const times = [];
        const currents = [];
        const voltages = [];
        const powers = [];

        Object.keys(joMeterData).forEach(ts => {
            const data = joMeterData[ts];

            const time = new Date(Number(ts)).toLocaleTimeString();

            times.push(time);

            currents.push((data.c || 0) / 1000);   // A
            voltages.push((data.v || 0) / 1000);   // V
            powers.push((data.p || 0) / 1000);     // kW
        });

        this.chartDataPoints = {
            times,
            currents,
            voltages,
            powers
        };

        this._updateChart();
        this._emit();
    }
    startCharging(data) {
        this.setMeterData(data);
    }
    stopCharging() {
        console.log("Charging stopped");
    }
}