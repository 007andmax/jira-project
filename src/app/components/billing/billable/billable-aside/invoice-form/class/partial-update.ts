export class PartialUpdate {
    date: string;
    dueDate: string;
    invoiceNumber: string;
    note: string;
    taxId: any;
    expensesToUpdate: any;
    constructor(date, dueDate, invoiceNumber, note, taxId, expensesToUpdate) {
        this.date = date;
        this.dueDate = dueDate;
        this.invoiceNumber = invoiceNumber;
        this.note = note;
        this.taxId = taxId;
        this.expensesToUpdate = expensesToUpdate;
    }
}