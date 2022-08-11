import Cell, { Resistor, VoltageSource, CurrentSource, Component } from "./cell.js";
import NetItem from "./NetItem.js";
import Reference from "./Reference.js";

//global var
let netnum;
let referenceNum;

export default class NodeVoltage {
    constructor(matrix) {
        this.matrix = matrix
        // console.log(this.matrix)
    }

    solve() {
        // console.log('solving')
        //find a wire on the matrix
        let part = this.find_a_part()
        if (!(part instanceof Cell)) {
            alert('No Wires or Components Found!')
            return null
        }
        //get a list of all significant nodes
        let nodes = this.find_all_nodes(part)
        nodes.forEach(node => {
            node.reference = null
        })

        // Create a net list to be solved using PySpice
        let list = this.create_net_list(nodes)
        // console.log(list.length)

        const fs = req('fs')

// Data which will write in a file.
        let data = "Learning how to write in a file."

// Write data in 'Output.txt' .
        fs.writeln('Output.txt', data, (err) => {
            if (err) throw err;
        })

        for (let i = 0; i< list.length; i++) {
            list[i].create_string()
            console.log(list[i].string)

        }
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
        // console.log('running find_all_nodes method')
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
        // alert('Successfully exited while loop')
        //now current_cell is a node if nodes are present
        // if no node was found, there are no nodes, return an empty Set
        if (current_cell.connected_parts.size < 3) {
            alert('no nodes detected')
            return current_cell
        } else {
            seen.clear()
            let x = this.node_search(current_cell, seen)
            // console.log(x.size, ' nodes found')
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
        // console.log('node searching ', node.x, node.y)
        seen_set.add(node)
        if (node.connected_parts.size >= 3) {
            nodes_set.add(node)
            // console.log('found a node at ', node.x, node.y)
            // console.log('the parts it is connected to are: ')
            // node.connected_parts.forEach(cn => {
            //     console.log(cn.x, cn.y, cn.type)
            // })
        }
        node.connected_parts.forEach(connected_cell => {
            //if not already seen
            if (!(seen_set.has(connected_cell))) {
                this.node_search(connected_cell, seen_set, nodes_set)
            }
        })
        return nodes_set
    }

    create_net_list(nodes) {
        // Now with a set of 'significant nodes' we must create a net list, however, the way net list references nodes
        // are different than the way we do: there also must be nodes in between any series connected components so that
        // we can differentiate parts in series and parallel. To avoid confusion, we will call the net list version of
        // nodes 'references'

        let seen = new Set()
        let list = [];
        referenceNum = 1
        netnum = 1
        nodes.forEach(node => {
            let newList = this.netitems_from_node(node, seen)
            list = list.concat(newList)
        })
        // console.log(list.length)
        return list
    }

    netitems_from_node(node, seen) {
        //takes a node and a seen set and returns a list of netitems (class NetItem) coming from said node
        seen.add(node)
        if (!(node.reference instanceof Reference)) {
            console.log('new ref created')
            node.reference = new Reference(referenceNum)
            referenceNum += 1
        }
        let prevRef = node.reference
        let netItems = []
        node.connected_parts.forEach(direction => {
            if (!(seen.has(direction))) {
                let itemList = []
                // console.log('running direction recurse initially')
                let nextItem = this.direction_recurse(direction, seen, node)
                let whileruns = 0
                while ((nextItem instanceof Component) && (whileruns < 10)) {
                    whileruns += 1
                    itemList.push(nextItem)
                    nextItem.connected_parts.forEach(connected => {
                        // console.log(connected.x, connected.y)
                        if (!(seen.has(connected))) {
                            nextItem = this.direction_recurse(connected, seen, node)
                        } else if ((connected.connected_parts.size >= 3) && (connected !== node)) {
                            // console.log('running else if')
                            nextItem = connected
                        }

                    })
                }
                // console.log('exited while')
                // console.log(itemList.length)
                //now itemList should contain all the list of components in a direction and nextItem should be the connected node
                if (itemList.size === 0) {
                    alert('hey add something that does something here')
                }
                if (nextItem.reference === null) {
                    console.log('new ref created 2')
                    nextItem.reference = new Reference(referenceNum)
                    referenceNum += 1
                }
                for (let i = 0; i < itemList.length; i++) {
                    let netitem = new NetItem(itemList[i], netnum)
                    netnum += 1
                    netitem.node1 = prevRef

                    if (i === (itemList.length - 1)) {
                        netitem.node2 = nextItem.reference
                    } else {
                        console.log('new ref created 3')
                        let inBetween = new Reference(referenceNum)
                        referenceNum += 1
                        netitem.node2 = inBetween
                        prevRef = inBetween
                    }
                    netItems.push(netitem)
                }
            }
        })
        return netItems
    }

    direction_recurse(direction, seen, node) {
        /**
         * called in a direction of a node/wire and returns the next appearing component or node
         */
        // console.log('direction recursing at', direction.x, direction.y)
        seen.add(direction)
        if ((direction instanceof Component) || (direction.connected_parts.size >= 3)) {
            // console.log('im a component or a node!')
            // console.log('returning', direction.x, direction.y)
            return direction
        } else {
            let array = []
            direction.connected_parts.forEach(cd => {
                array.push(cd)
            })
            for (let i=0; i < array.length; i++) {
                if (!(seen.has(array[i]))) { // if the connected direction hasn't been seen
                    // console.log('i havent yet seen', array[i].x, array[i].y)
                    let recursive = this.direction_recurse(array[i], seen, node) // recursively call the function on that cell
                    // console.log('successfully recursed back to', direction.x, direction.y)
                    // console.log(recursive.type)
                    // console.log('returning', recursive.x, recursive.y, 'after running', direction.x, direction.y, 'and iterating by', array[i].x, array[i].y)
                    return recursive // return whatever is returned by said cell
                } else if (((array[i].connected_parts.size >= 3)) && (array[i] !== node)) {
                    // console.log('ive already seen', array[i].x, array[i].y, 'but its a node')
                    return array[i]
                } else {
                    // console.log('failed all if statements when at direction', direction.x, direction.y, 'iterating at', array[i].x, array[i].y)
                }
            }
        }
        alert('somehow returning nothing')
    }
}