import { TicketAdd } from './ticket-add';

export class TicketValidate {
    subject: boolean = true;
    company: boolean = true;
    clientUser: boolean = true;
   
    constructor() { }
    public getCompany(){
        return this.company;
    }
    public resetCompany() {
        this.company = true;
    }
    public getSubject(){
        return this.subject;
    }
    public resetSubject() {
        this.subject = true;
    }
    public getClientUser(){
        return this.clientUser;
    }
    public resetClientUser() {
        this.clientUser = true;
    }
    
    public checkValidCompany(company) {
        if (!company) {
            this.company = false;
        } else {
            this.company = true;
        }
    }
    public checkSubject(subject) {
        if (subject.length === 0) {
            this.subject = false;
        } else {
            this.subject = true;
        }

    }
    public checkValidClientUser(user) {
        if (!user) {
            this.clientUser = false;
        } else {
            this.clientUser = true;
        }

    }
   
    public isValidate(ticket: TicketAdd) {
        if (!ticket.createdUser.companyId) this.company = false;
        if (ticket.subject.length === 0) this.subject = false;
        if (!ticket.createdUser.id) this.clientUser = false;
           return this.company && this.subject && this.clientUser;

    }
}