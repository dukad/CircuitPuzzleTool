export default class NetItem {
    constructor(component, netnum) {
        this.component = component
        this.reference = netnum
        this.node1 = null
        this.node2 = null
        this.string = null
    }

    create_string() {
        this.string = this.component.abbr + this.reference + ' ' + this.node1.string +  ' ' + this.node2.string +  ' ' + (this.component.value).toString()
    }
}