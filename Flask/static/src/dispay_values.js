import Reference from "./Reference.js";
import Cell, { Component, Wire } from './cell.js'

export default function DisplayValues(sol_string, node_list, comp_list) {
    console.log(sol_string)
    let split = sol_string.split('\n\n')
    let voltages = split[0].split('\n')
    let currents = split[1].split('\n')
    display_voltages(voltages, node_list)
    display_currents(currents, comp_list)
}

function display_currents(currents, comp_list) {
    for (let i = 0; i < currents.length; i++) {
        let split = currents[i].split(' ')
        let comp = split[0].substring(1)
        comp = comp.replace(/\D/g,'');
        if (comp[0] === 'r')
            comp = comp.substring(1)
        let value = split[1]

        let j = 0
        let compnum = comp_list[j]

        while (parseInt(comp) !== compnum.reference) {
            console.log('while running', j)
            console.log('running')
            console.log(compnum.reference)
            console.log(parseInt(comp))
            console.log(comp)
            j++
            compnum = comp_list[j]
        }
        compnum.component.current = value
        compnum.component.render_current()
    }
}

function display_voltages(voltages, node_list) {
    console.log(voltages.length)
    console.log(node_list.length)

    for (let i = 0; i < voltages.length; i++) {
        let split = voltages[i].split(' ')
        let node = split[0]
        let value = split[1]
        let ref = node.substring(1)
        // console.log(ref)
        let j = 0
        let nodenum = node_list[j]

        if (nodenum.node instanceof Component) {
            console.log('hi')
        } else {
            // console.log(nodenum instanceof Reference)
            while (parseInt(ref) !== nodenum.refnumber) {
                console.log('running')
                j++
                nodenum = node_list[j]
            }
        }
        nodenum.node.voltage = value
        nodenum.node.render_voltage()
    }
}