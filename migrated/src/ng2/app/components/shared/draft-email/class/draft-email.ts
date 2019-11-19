export class DraftEmail {
    attachments: Array<string> = [];
    content: string;
    customHtml: boolean = false;
    recipients: Array<string> = [];
    subject: string = "";
    constructor() { }
public setCustomHtml (value) {
    this.customHtml = value;
}

    public addAttachment(id) {
        this.attachments.push(id);
    }
    public setContent(data) {
        this.content = data;
    }
    public setRecipients(data) {
        this.recipients = data;

    }
    public setAttachment(id) {
        this.attachments.push(id);
    }




}