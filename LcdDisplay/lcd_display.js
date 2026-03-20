class LcdDisplay{
    constructor(container){
        this.container = container;
        this.interval=null;
        this.index=0;
        this._createUI();
    }
    _createUI() {
        this.lcd = document.createElement("div");
        this.lcd.className = "lcd-container";

        this.lcdTop = document.createElement("div");
        this.lcdTop.className="lcd-top";

        this.voltage = document.createElement("div");
        this.current = document.createElement("div");
        this.energy = document.createElement("div");
        this.voltage.className = "voltage";
        this.current.className = "current";
        this.energy.className = "energy";

        this.reset();

        this.lcdTop.appendChild(this.voltage);
        this.lcdTop.appendChild(this.current);
        this.lcdTop.appendChild(this.energy);

        this.lcd.appendChild(this.lcdTop);
        this.container.appendChild(this.lcd);
    }
    update(voltage, current, energy) {
        this.voltage.innerText = voltage.toFixed(2) + " V";
        this.current.innerText = current.toFixed(2) + " A";
        this.energy.innerText = energy.toFixed(2) + " Wh";

        console.log(`Voltage: ${voltage.toFixed(2)} V | Current: ${current.toFixed(3)} A | Energy: ${energy.toFixed(0)} Wh`);
        // const energyDisplay = formatEnergy(energy);
        // this.energy.innerText = energyDisplay.value + " " + energyDisplay.unit;

    }
    reset() {
        this.voltage.innerText = "-- V";
        this.current.innerText = "-- A";
        this.energy.innerText = "-- Wh";
        console.log("\nReset");
    }
    startCharging(meterSeries){
        if(this.interval) return;
        console.log("\nStart Charging");

        if(meterSeries) this.meterSeries = meterSeries;

        this.interval = setInterval(() => {
            if(this.index >= meterSeries.length){
                this.stopCharging();
                console.log("\nCharging Complete");
                this.index=0;
                return;
            }

            const m = meterSeries[this.index];

            const voltage = m.v / 1000;
            const current = m.c / 1000;
            const energy = m.e;

            this.update(voltage, current, energy);

            this.index++;
        }, 1000);
    }
    stopCharging(){
        clearInterval(this.interval);
        this.interval = null;
        console.log("\nStop Charging");
    }
}