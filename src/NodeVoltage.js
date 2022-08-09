import Cell, { Resistor, VoltageSource, CurrentSource } from "./cell.js";

export default class NodeVoltage {
    constructor(matrix) {
        this.matrix = matrix
        // console.log(this.matrix)
    }

    solve() {
        console.log('solving')
        //find a wire on the matrix
        let part = this.find_a_part()
        if (!(part instanceof Cell)) {
            alert('No Wires or Components Found!')
            return null
        }
        //get a list of all significant nodes
        let nodes = this.find_all_nodes(part)
        //if the list has no items
            // start at this.cell, designated ground before the voltage source
            //find the total resistance of the circuit,
            //find the total voltage gain of the circuit
            //use these to find the current through the total circuit
        //if the list has items (one item shouldn't be possible I believe)
            //find the node with the greatest / lowest y coordinate, designate it as ground possible adding a visual
            //iterate through each other node
                // progress through each available path until reaching another node or ending
                    // if you encounter a component, add it to a list for the node
                    //sum necessary voltages, resistors, and currents to form the proper equation for the node
            //use system of equations to solve

    }

    find_a_part() {
        let height = this.matrix.length
        let width = this.matrix[0].length
        for (let i=0; i< height; i++) {
            for (let j=0; j<width; j++) {
                let cell = this.matrix[i][j]
                // console.log(cell.x, cell.y, cell.type)
                if ((cell.type === 'Wire') || (cell.type === 'Component')) {
                    return cell
                }
            }
        }
        return null
    }

    find_all_nodes(part) {
        /**
         * Based on one cell, go through the entire group of connected cells and mark all significant nodes in a set
         *
         */
        //starting with any cell
            //if the number of directions possible is 1 or 2, go until finding a node
            // if the number is 3 or >3, you're already there
        console.log('running find_all_nodes method')
        let current_cell = part
        let seen = new Set()
        let value = current_cell.connected_parts.size
        let connection_count = 0
        while (value < 3) { //keep going until a node is found
            // console.log(current_cell.x, current_cell.y, current_cell.type)
            // console.log(current_cell.connected_parts.size)
            seen.add(current_cell) //mark the current cell as seen as to not come back to it
            connection_count = 0
            if (current_cell.connected_parts.size >= 2) {
                // console.log('running if statement')
                current_cell.connected_parts.forEach(direction_cell => { // check in all directions
                    connection_count += 1
                    if (!seen.has(direction_cell)) {
                        if (direction_cell.connected_parts.size >= 2) { // if the connected cell is a node
                            current_cell = direction_cell // become the node
                            connection_count = 0
                            value = current_cell.connected_parts.size
                        } else {
                            alert('Open circuit detected')
                            value = 3
                        }
                    }
                })
                if(connection_count === current_cell.connected_parts.size) {
                    value = 3
                }
            } else {
                alert('Open circuit detected 2')
                value = 3 // break the while loop
            }
        }
        alert('Successfully exited while loop')
        //now current_cell is a node if nodes are present
        // if no node was found, there are no nodes, return an empty Set
        if (current_cell.connected_parts.size < 3) {
            alert('no nodes detected')
            return current_cell
        } else {
            seen.clear()
            let x = this.node_search(current_cell, seen)
            console.log(x.size, ' nodes found')
            return x
        }
    }

    node_search(node, seen_set, nodes_set=new Set()) {
        /**
         * from any one given node, find a list of nodes that are directly connected
         */
        //starting at a node, go through each possible direction until finding another node that hasn't been seen before
        //     console.log('running node search method')
        //start at a node
        //for each surrounding direction
        console.log('node searching ', node.x, node.y)
        seen_set.add(node)
        if (node.connected_parts.size >= 3) {
            nodes_set.add(node)
            console.log('found a node at ', node.x, node.y)
            console.log('the parts it is connected to are: ')
            node.connected_parts.forEach(cn => {
                console.log(cn.x, cn.y, cn.type)
            })
        }
        node.connected_parts.forEach(connected_cell => {
            //if not already seen
            if (!(seen_set.has(connected_cell))) {
                this.node_search(connected_cell, seen_set, nodes_set)
            }
        })
        return nodes_set
    }
}