import Cell, { Wire, Component } from './cell.js'
import Toolbar from "./toolbar.js";


export default class Board {

    constructor(grid_height, grid_width, cell_dimension, app) {
        this.cell = [];
        this.grid_height = grid_height;
        this.grid_width = grid_width;
        this.cell_dimension = cell_dimension;
        this.app = app

        this.list = ['Eraser', 'Wire', 'Resistor', 'VoltageSource', 'CurrentSource']

        this.toolbar = new Toolbar(this.app, this.list, this.cell_dimension)

        this.resistor = false;
        this.voltage = false;
        this.wire = false;
        this.erased = false;
        this.app = app;

        this.mode = 'default'
        this.string = '';
        this.selectedCell = null

    }

    create() {
        this.create_matrix()
        this.connectCells()
        this.toolbar.create()
    }

    create_matrix() {
        for (let i = 0; i < this.grid_height; i++) {
            this.cell[i] = [];
        }
        // create a matrix of cells
        for (let i = 0; i < this.grid_height; i++) {
            for (let j = 0; j < this.grid_width; j++) {
                // adding the new cell to the array
                let newCell = new Cell(j, i, this.cell_dimension, this.app, this.cell, this)
                newCell.draw()
                this.cell[i][j] = newCell;
            }
        }
    }


    connectCells() {
        for (let i = 0; i < this.grid_height; i++) {
            for (let j = 0; j < this.grid_width; j++) {
                //this.cell[2][2].top = this.cell[1][2];
                if (i !== 0) {
                    this.cell[i][j].top = this.cell[i - 1][j];
                }

                if (j !== 0) {
                    this.cell[i][j].left = this.cell[i][j - 1];
                }

                if (j < this.grid_width - 1) {
                    this.cell[i][j].right = this.cell[i][j + 1];
                }
                if (i < this.grid_height - 1) {
                    this.cell[i][j].bottom = this.cell[i + 1][j];
                }

            }
        }
    }



    onKeyPress(key) {
        let numbers = new Set()
        numbers.add('.')
        for (let i = 0; i< 10; i++) {
            numbers.add(i.toString())
        }
        if (this.selectedCell instanceof Component) {
            this.string = this.selectedCell.value.toString()
            if (this.string === 'NaN') {
                this.string = ''
            }
        }
        console.log('letter typed is: ', key)
        console.log('type is:', typeof this.string)
        if (this.mode === "editing") {
            if (key === 'Backspace') {
                console.log('running Backspace')
                this.string = this.string.slice(0, -1)
                let val = parseFloat(this.string)
                this.selectedCell.changeval(val)
                this.selectedCell.render_value()

            } else if (key === 'Enter') {
                this.changeMode(this.cell)

            } else if (numbers.has(key)) {
                this.string = this.string + key
                console.log(this.string)
                let val = parseFloat(this.string)
                this.selectedCell.changeval(val)
                this.selectedCell.render_value()
            }
        } else if (this.mode === 'default') {
        } else {
            console.log(':O')
        }
    }

    changeMode(cell) {
        if (this.selectedCell === cell) {
            if (this.mode === 'default') {
                this.mode = 'editing'
                if (this.selectedCell instanceof Component) {
                    this.string = this.selectedCell.value.toString()
                }
                console.log('this.mode =', this.mode)
            } else {
                this.mode = 'default'
                console.log('this.mode =', this.mode)
            }
        } else {
            if (this.selectedCell instanceof Cell) {
                console.log('running')
                let oldCell = this.selectedCell
                this.selectedCell = cell
                if (this.selectedCell instanceof Component) {
                    this.string = this.selectedCell.value.toString()
                }
                oldCell.render_value()
            }
            this.selectedCell = cell
            this.mode = 'editing'
            console.log('this.mode =', this.mode)
        }
    }
}
