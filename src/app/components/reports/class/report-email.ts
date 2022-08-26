export class ReportEmail {
    subject: string = '';
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
    public getDataForInvoiceReport(invoices) {
        return {
            "recipients": this.emails,
            "subject": this.subject,
            "invoiceReportDto": {
                "inv0oiceViewDtos": invoices
            },
            /* fileName: this.fileName,
             content: this.content,
             note: this.note,
             orientation: "LANDSCAPE"*/
        }
    }
}