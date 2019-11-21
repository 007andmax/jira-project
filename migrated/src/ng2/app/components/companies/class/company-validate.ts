import { CompanyProfile } from './company-profile';


export class CompanyValdiate {
    name: boolean = true;
    type: boolean = true;
    domain: boolean = true;
    firstName: boolean = true;
    primaryContactEmail: boolean = true;
    phoneNumber: boolean = true;
    reEmail = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
    rePhoneNumber = /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/;
    reDomain = /^((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
    nameIsExist: boolean = false;
    constructor() { }
    public getDomain(){
        return this.domain;
    }
    public resetNameIsExist() {
        this.nameIsExist = false;
    }
    public setNameIsExist() {
        this.nameIsExist = true;
    }
    public setNoValidName() {
        this.name = false;
    }
    public resetName() {
        this.name = true;
    }
    public resetType() {
        this.type = true;
    }
    public getNameIsExist() {
        return this.nameIsExist;
    }
    public getName() {
        return this.name;
    }
    public getType() {
        return this.type;
    }

    public getFirstName() {
        return this.firstName;
    }
    public getPrimaryContactEmail() {
        return this.primaryContactEmail;
    }
    public getPhoneNumber() {
        return this.phoneNumber;
    }
    public checkValidName(name) {
        if (!name || name.length === 0) {
            this.name = false;
        } else {
            this.name = true;
        }
    }
    public checkValidType(clientType) {
        if (clientType.length === 0) {
            this.type = false;
        } else {
            this.type = true;
        }

    }
    public checkValidPhoneNumber(number) {
        if (!number || !number.match(this.rePhoneNumber)) {
            this.phoneNumber = false;
        } else {
            this.phoneNumber = true;
        }

    }
    public checkValidDomain(domain) {
        if (domain && !domain.match(this.reDomain)) {
            this.domain = false;
        } else {
            this.domain = true;
        }
    }

    public checkValidPrimaryEmail(primaryEmail) {
        if (!primaryEmail || !primaryEmail.match(this.reEmail)) {
            this.primaryContactEmail = false;
        } else {
            this.primaryContactEmail = true;
        }


    }

    public checkValidFirstname(firstName) {
        if (!firstName || firstName.length === 0) {
            this.firstName = false;
        } else {
            this.firstName = true;
        }


    }
    public isValidate(company: CompanyProfile) {
        if (!company.contacts[0].firstName || company.contacts[0].firstName.length === 0) this.firstName = false;
        if (!company.name || company.name.length === 0) this.name = false;
        if (company.clientType === "") this.type = false;
        if (!company.contacts[0].primaryEmail || !company.contacts[0].primaryEmail.match(this.reEmail)) this.primaryContactEmail = false;
        if (!company.addresses[0].phoneNumbers[0].number || !company.addresses[0].phoneNumbers[0].number.match(this.rePhoneNumber)) this.phoneNumber = false;
        if (company.domain && !company.domain.match(this.reDomain)) this.domain = false;
        return this.name && this.type && this.primaryContactEmail && this.phoneNumber && this.firstName && this.domain;

    }


}