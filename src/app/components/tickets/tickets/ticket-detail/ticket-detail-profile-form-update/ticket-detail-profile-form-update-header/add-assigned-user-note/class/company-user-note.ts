import { CompanyUser } from "src/app/components/tickets/tickets/ticket-add-aside/company-users-drop-down/class/company-user";

export class CompanyUserNote extends CompanyUser {

    isCustomEmail: boolean = false;
    recipient: string = "";
    public setRecipient(data) {
        this.recipient = data;
    }
    public setIsCustomEmail(data) {
        this.isCustomEmail = data;
    }
}