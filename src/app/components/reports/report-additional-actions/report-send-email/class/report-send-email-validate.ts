import { ReportEmail } from "../../../class/report-email";

export class ReportSendEmailValidate {
    subject: boolean = true;
    email: boolean = true;
    constructor() {

    }
    public resetSubject() {
        this.subject = true;
    }
    public getSubject() {
        return this.subject;
    }
    public resetEmail() {
        this.email = true;
    }
    public getEmail() {
        return this.email;
    }
    public isValidate(draftEmail: ReportEmail) {
        if (draftEmail.subject.length == 0 || draftEmail.subject.length > 250) this.subject = false;
        if (draftEmail.emails.length == 0) this.email = false;
        return this.subject && this.email;
    }
}