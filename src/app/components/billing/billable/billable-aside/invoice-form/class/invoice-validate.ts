export class InvoiceValidate {
    number: boolean = true;
    public getNumber() {
        return this.number;
    }
    public resetNumber() {
        this.number = true;
    }
    public setNumberValid(valid) {
        this.number = valid;
    }
}