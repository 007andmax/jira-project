import { CompanyProfileContact } from './company-profile-contact';

export class CompanyProfileAddress {
    id: string;
    sameAsShipping: boolean;
    locationName: string;
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
    constructor(data = null) {
        if (data) {
            for (const key in data) {
                this[key] = data[key];
            }
        } else {
            this.phoneNumbers = [{
                number: '',
                typeNumber: 'OFFICE'
            }];
        }

    }
    public checkForAdd() {
        if (this.address && this.address.length > 0
            || this.locationName && this.locationName.length > 0
            || this.suiteNumber && this.suiteNumber.length > 0
            || this.postalCode && this.postalCode.length > 0
            || this.phoneNumbers.length > 0 && this.phoneNumbers[0].number.length > 0) return true;
        return false;
    }
    public initSameAsShipping(data) {
        let phoneNumbers = JSON.parse(JSON.stringify(this.phoneNumbers));
        this.sameAsShipping = true;
        this.locationName = data.locationName;
        this.isPrimary = false;
        this.address = data.address;
        this.addressWithSuitNumberAndPostalCode = data.addressWithSuitNumberAndPostalCode;
        this.countryCode = data.countryCode;
        this.locationLat = data.locationLat;
        this.locationLng = data.locationLng;
        this.fromGoogle = data.fromGoogle;
        this.postalCode = data.postalCode;
        this.suiteNumber = data.suiteNumber;
        this.phoneNumbers = data.phoneNumbers.map((item, index) => {
            let id;
            if (index != phoneNumbers.length) id = phoneNumbers[index].id;
            return {
                id: id,
                number: item.number,
                priority: item.priority,
                typeNumber: item.typeNumber,
            }
        });
        this.locale = data.locale;
        this.timeZone = data.timeZone;
    }
    public fullVersion() {
        this.locationName = '';
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