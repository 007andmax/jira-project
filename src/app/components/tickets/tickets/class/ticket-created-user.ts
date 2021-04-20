export class TicketCreatedUser {
    companyId: string;
    firstName: string;
    id: string;
    primaryEmail: string;
    constructor() {
     
    }
    public setCompanyId (companyId) {
        this.companyId = companyId;
    }
     
    public setUserData(data) {
        this.firstName = data.firstName;
        this.id = data.id;
        this.primaryEmail = data.primaryEmail;
    }
    public clearUserData() {
        this.firstName = null;
        this.id = null;;
        this.primaryEmail = null;
    }
}