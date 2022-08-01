import Cell, { Resistor, VoltageSource, CurrentSource } from "./cell.js";

export default class NodeVoltage {
    constructor(cell) {
        this.cell = cell
    }

    solve() {
        console.log('solving');
    }
}