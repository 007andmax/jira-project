import { InvoiceNote } from "src/app/components/billing/billable/class/invoice-note";

export class ValidateNote {
    title: boolean = true;
    content: boolean = true;

    public resetTitle() {
        this.title = true;
    }
    public resetContent() {
        this.content = true;
    }
    public getTitle() {
        return this.title;
    }
    public getContent() {
        return this.content;
    }
    public isValidate(note: InvoiceNote) {
        if (!note.title || note.title.length < 1) this.title = false;
        if (!note.content || note.content.length < 1) this.content = false;
        return this.title && this.content;

    }
}