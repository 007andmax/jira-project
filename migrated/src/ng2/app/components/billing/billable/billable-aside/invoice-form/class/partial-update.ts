export class PartialUpdate {
    date: string;
    dueDate: string;
    invoiceNumber: string;
    regularInvoiceNote: any;
    taxId: any;
    constructor(date,dueDate,invoiceNumber,regularInvoiceNote,taxId) {
        this.date = date;
        this.dueDate = dueDate;
        this.invoiceNumber = invoiceNumber;
        this.regularInvoiceNote = regularInvoiceNote;
        this.taxId = taxId;
    }
}