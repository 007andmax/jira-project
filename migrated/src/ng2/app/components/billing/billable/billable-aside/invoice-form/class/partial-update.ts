export class PartialUpdate {
    date: string;
    dueDate: string;
    invoiceNumber: string;
    regularInvoiceNote: any;
    taxId: any;
    expensesToUpdate:any;
    constructor(date,dueDate,invoiceNumber,regularInvoiceNote,taxId,expensesToUpdate) {
        this.date = date;
        this.dueDate = dueDate;
        this.invoiceNumber = invoiceNumber;
        this.regularInvoiceNote = regularInvoiceNote;
        this.taxId = taxId;
        this.expensesToUpdate = expensesToUpdate;
    }
}