import Cell, { Resistor, Component } from "./cell";

export default class NodeVoltage {
    constructor(cell) {
        this.cell = cell
    }

    solve() {
        console.log('solving');
        let importing_cells = new Set()

    }
}