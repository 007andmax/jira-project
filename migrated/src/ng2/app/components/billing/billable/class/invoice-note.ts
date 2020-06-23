export class InvoiceNote {
    id: string;
    line1: string;
    line2: string;
    noteType: string;
    title: string;
    constructor(data) {
        this.id = data.id;
        this.line1 = data.line1;
        this.line2 = data.line2;
        this.noteType = data.noteType;
        this.title = data.title;
    }
}