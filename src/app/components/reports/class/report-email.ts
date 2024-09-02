export class ReportEmail {
    subject: string = '';
    content: string = "Income accounts"
    emails: Array<string>;
    fileName: string = "income_accounts";
    orientation: string = 'PORTRAIT';
    note: string;
    attachments: Array<string> = [];
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
    public setAttachments(data) {
        this.attachments = data;
    }
    public setNote(data) {
        this.note = data;
    }
    public getDataForInvoiceReport(invoices) {
        return {
            "recipients": this.emails,
            "subject": this.subject,
            "invoiceReportDto": {
                "invoiceViewDtos": invoices
            },
            note: this.note,
            attachments: this.attachments
            /* fileName: this.fileName,
             content: this.content,
             orientation: "LANDSCAPE"*/
        }
    }
    public getDataForPaymentReport(payments) {
        return {
            "recipients": this.emails,
            "subject": this.subject,
            paymentReportDto: {
                paymentViewDtos: payments
            },
            note: this.note,
            attachments: this.attachments
            /* fileName: this.fileName,
             content: this.content,
             orientation: "LANDSCAPE"*/
        }
    }
}