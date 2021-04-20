export class ReportEmail {
    content: string = "Income accounts"
    emails: Array<string>;
    fileName: string = "income_accounts";
    orientation: string = 'PORTRAIT';
    note: string;
    constructor() { }

    public setContent(data) {
        this.content = data;
    }
    public setEmails(data) {
        this.emails = data;

    }
    public setFileName(data) {
        this.fileName = data;
    }
    public setOrientation(data) {
        this.orientation = data;
    }

    public setNote(data) {
        this.note = data;
    }
}