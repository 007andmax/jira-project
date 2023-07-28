import { DraftEmail } from "./draft-email";

export class DraftEmailValidate {
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
    public isValidate(draftEmail: DraftEmail) {
        if (draftEmail.subject.length == 0 || draftEmail.subject.length > 250) this.subject = false;
        if (draftEmail.recipients.length == 0) this.email = false;
        return this.subject && this.email;
    }
}