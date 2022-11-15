import { ReportEmail } from "../../../class/report-email";

export class ReportSendEmailValidate {
    subject: boolean = true;
    constructor() {

    }
    public resetSubject() {
        this.subject = true;
    }
    public getSubject() {
        return this.subject;
    }
    public isValidate(draftEmail: ReportEmail) {
        if (draftEmail.subject.length == 0 || draftEmail.subject.length > 250) this.subject = false;
        return this.subject;
    }
}