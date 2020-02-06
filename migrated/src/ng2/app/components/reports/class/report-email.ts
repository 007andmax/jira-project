export class ReportEmail {
    content:string = "GL number"
    emails:Array<string>;
    fileName:string = "gl_number";
    orientation:string = 'PORTRAIT';
    note:string;
    constructor() {}

    public setEmails(data) {
        this.emails = data;

    }
    
    public setNote(data) {
        this.note = data;
    }
}