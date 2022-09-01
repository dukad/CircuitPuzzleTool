import {CurrentSource, VoltageSource} from "./cell.js";

export default class NetItem {
    constructor(component, netnum) {
        this.component = component
        this.component.netitem = this
        this.reference = netnum
        this.node1 = null
        this.node2 = null
        this.string = null
    }

    create_string() {
        this.string = this.component.abbr + this.reference + ' ' + this.node1.string +  ' ' + this.node2.string +  ' ' + (this.component.value).toString()
    }

    flip_nodes() {
        let temp = this.node1
        this.node1 = this.node2
        this.node2 = temp
    }
}