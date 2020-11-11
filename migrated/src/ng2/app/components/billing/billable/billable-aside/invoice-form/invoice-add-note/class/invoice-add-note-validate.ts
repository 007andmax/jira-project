import { InvoiceNote } from '../../../../class/invoice-note';

export class InvoiceAddNoteValidate {
    title: boolean = true;
    line1: boolean = true;

    constructor() { }
    public getTitle(){
        return this.title;
    }
    public getLine1(){
        return this.line1;
    }
    public checkValidTitle(title) {
        if (!title || title.length === 0) {
            this.title = false;
        } else {
            this.title = true;
        }
    }

    public checkValidLine1(line1) {
        if (!line1 || line1.length === 0) {
            this.line1 = false;
        } else {
            this.line1 = true;
        }
    }

    public isValidate(note: InvoiceNote) {
        if (!note.title || note.title.length === 0) this.title = false;
        if (!note.line1 || note.line1.length === 0) this.line1 = false;
        return this.title && this.line1;

    }
}