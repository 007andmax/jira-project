import { CompanyProfile } from './company-profile';

export class CompanyValdiate {
    name:boolean = true;
    type:boolean = true;
    firstName:boolean = true;
    primaryContactEmail:boolean = true;
    phoneNumber:boolean = true;
    constructor() {}

    public getName() {
        return this.name;
    }
    public getType () {
        return this.type;
    }

    public getFirstName () {
        return this.firstName;
    }
    public getPrimaryContactEmail () {
        return this.primaryContactEmail;
    }
    public getPhoneNumber () {
    return this.phoneNumber;
    }

    public isValidate (company: CompanyProfile) {
        if (company.name === "") this.name = false;
        if (company.clientType === "") this.type = false;
        if (company.clientType === "") this.type = false;
        if (company.contacts[0].primaryEmail === "") this.primaryContactEmail = false;
        if (company.addresses[0].phoneNumbers[0].number === "") this.phoneNumber = false;

    }
    
}