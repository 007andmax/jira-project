import { CompanyProfileContact } from './company-profile-contact';

export class CompanyProfileAddress {
    isPrimary: boolean;
    address: string;
    fromGoogle: boolean;
    postalCode: string;
    suiteNumber: string;
    phoneNumbers: any;
    locale: string;
    timeZone: any;
    constructor() {
       
    }
    public fullVersion() {
        this.address = '';
        this.fromGoogle = false;
        this.isPrimary = true;
        this.phoneNumbers = [{
            number: '',
            typeNumber: 'OFFICE'
        }];
        this.postalCode = '';
        this.suiteNumber = '';
        this.locale = '';
        this.timeZone = {
            name: '',
            timeOffset: ''
        }
    }
    public shortVersion(contact: CompanyProfileContact) {
        this.isPrimary = true;
        this.phoneNumbers = contact.phoneNumbers;
    }
}