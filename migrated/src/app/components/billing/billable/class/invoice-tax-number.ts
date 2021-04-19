export class InvoiceTaxNumber {
    taxId: string;
    taxIdDescription:string;
    constructor(data) {
        this.taxId = data.taxId;
        this.taxIdDescription = data.taxIdDescription;
    }
}