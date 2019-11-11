export class CompanyProfileContact {
    firstName:string;
    phoneNumbers:any;
    lastName:string;
    primaryEmail:string;
    subscription:any;
    designation:string;
    constructor () {
        this.firstName = null;
        this.phoneNumbers = [{
            number: '',
            typeNumber: 'OFFICE'
        }];
        this.lastName = null,
        this.primaryEmail = null,
        this.subscription = {
            invoice: true,
            ticket: true,
            ticketManager:  false
        }
    }
    public fullVersion() {
        this.designation = null;
    }
   
}