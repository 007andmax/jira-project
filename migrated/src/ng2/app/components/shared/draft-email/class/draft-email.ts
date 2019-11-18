export class DraftEmail {
    attachments: Array<string> = [];
    content: string
    customHtml: boolean = false;
    recipients: Array<string> = [];
    subject: string;
    constructor() { }

    public addAttachment(id) {
        this.attachments.push(id);
    }
}