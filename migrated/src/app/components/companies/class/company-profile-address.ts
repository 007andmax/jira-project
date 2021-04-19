import { CompanyProfileContact } from './company-profile-contact';

export class CompanyProfileAddress {
    isPrimary: boolean;
    address: string;
    addressWithSuitNumberAndPostalCode: string;
    countryCode: string;
    locationLat: number;
    locationLng: number;
    fromGoogle: boolean;
    postalCode: string;
    suiteNumber: string;
    phoneNumbers: any;
    locale: string;
    timeZone: any;
    constructor() {
        this.phoneNumbers = [{
            number: '',
            typeNumber: 'OFFICE'
        }];
    }
    public fullVersion() {
        this.address = '';
        this.fromGoogle = false;
        this.isPrimary = true;

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
    }
}