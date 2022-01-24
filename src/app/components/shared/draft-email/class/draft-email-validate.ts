import { DraftEmail } from "./draft-email";

export class DraftEmailValidate {
    subject: boolean = true;
    constructor() {

    }
    public resetSubject() {
        this.subject = true;
    }
    public getSubject() {
        return this.subject;
    }
    public isValidate(draftEmail: DraftEmail) {
        if (draftEmail.subject.length == 0 || draftEmail.subject.length > 250) this.subject = false;
        return this.subject;
    }
}