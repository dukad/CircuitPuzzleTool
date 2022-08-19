export default class Reference {
    constructor(refnumber) {
        this.refnumber = refnumber
        this.string = 'N' + this.refnumber.toString()
        if (this.refnumber === 0) {
            this.string = '0'
        }
    }

}