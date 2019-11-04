export class CompanyProfileContact {
    firstName:string;
    phoneNumbers:any;
    lastName:string;
    primaryEmail:string;
    subscription:any;
    designation:string;
    constructor () {
        this.firstName = '';
        this.phoneNumbers = [{
            number: '',
            typeNumber: 'OFFICE'
        }];
        this.lastName = '',
        this.primaryEmail = '',
        this.subscription = {
            invoice: true,
            ticket: true,
            ticketManager:  false
        }
    }
    public fullVersion() {
        this.designation = '';
    }
   
}