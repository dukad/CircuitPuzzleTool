export default class Reference {
    constructor(refnumber, node) {
        this.node = node
        this.refnumber = refnumber
        this.string = 'N' + this.refnumber.toString()
        if (this.refnumber === 0) {
            this.string = '0'
        }

    }

}