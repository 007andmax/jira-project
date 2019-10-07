import { CompanyProfileContact } from './company-profile-contact';

export class CompanyProfileAddress {
    isPrimary: boolean;
    address:string;
    fromGoogle:boolean;
    postalCode:string;
    suiteNumber:string;
    phoneNumbers: any;
    constructor () {
     
    }
    public shortVersion (contact:CompanyProfileContact) {
        this.isPrimary = true;
        this.phoneNumbers = contact.phoneNumbers;
    }
}