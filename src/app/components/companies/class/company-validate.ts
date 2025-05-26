import { Directive } from '@angular/core';
import { CompanyProfile } from './company-profile';


export class CompanyValdiate {
    name: boolean = true;
    type: boolean = true;
    domain: boolean = true;
    domainValid: boolean = true;
    firstName: boolean = true;
    primaryContactEmail: boolean = true;
    phoneNumber: boolean = true;
    primaryPhoneNumber: boolean = true;
    shippingPhoneNumber: boolean = true;
    billindAddress: boolean = true;
    shippingAddress: boolean = true;
    user: boolean = true;
    rePhoneNumber = /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/;
    reEmail = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
    reDomain = /^((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
    nameIsExist: boolean = false;
    domainIsExist: boolean = false;
    existPrimaryContactEmail: boolean = true;
    isCheckingEmail: boolean = false;
    constructor() { }
    public setIsCheckingEmail(data) {
        this.isCheckingEmail = data;
    }
    public getBillindAddress() {
        return this.billindAddress;
    }
    public getShippingAddress() {
        return this.shippingAddress;
    }
    public getUser() {
        return this.user;
    }
    public resetUser() {
        this.user = true;
    }
    public resetBillindAddress() {
        this.billindAddress = true;
    }
    public resetShippingAddress() {
        this.shippingAddress = true;
    }
    public resetExistPrimaryContactEmail() {
        this.existPrimaryContactEmail = true;
    }
    public getExistPrimaryContactEmail() {
        return this.existPrimaryContactEmail;
    }
    public setExistPrimaryContactEmail(data) {
        this.existPrimaryContactEmail = data;
    }
    public getDomain() {
        return this.domain;
    }
    public getDomainValid() {
        return this.domainValid;
    }
    public resetDomainValid() {
        this.domainValid = true;
    }
    public resetDomain() {
        this.domain = true;
    }
    public resetDomainIsExist() {
        this.domainIsExist = false;
    }
    public setDomainIsExist() {
        this.domainIsExist = true;
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
    public getDomainIsExist() {
        return this.domainIsExist;
    }
    public getName() {
        return this.name;
    }
    public getType() {
        return this.type;
    }
    public getPrimaryPhoneNumber() {
        return this.primaryPhoneNumber;
    }
    public resetFirstName() {
        this.firstName = true;
    }
    public getFirstName() {
        return this.firstName;
    }
    public resetPrimaryContactEmail() {
        this.primaryContactEmail = true;
    }
    public getPrimaryContactEmail() {
        return this.primaryContactEmail;
    }
    public getPhoneNumber() {
        return this.phoneNumber;
    }
    public getShippingPhoneNumber() {
        return this.shippingPhoneNumber;
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
    public checkValidPrimaryPhoneNumber(number) {
        if (number.length > 0 && number.length < 14) {
            this.primaryPhoneNumber = false;
        } else {
            this.primaryPhoneNumber = true;
        }
    }
    public checkValidShippingPhoneNumber(number) {
        if (number.length > 0) {
            if (number.length < 14) {
                this.shippingPhoneNumber = false;
            } else {
                this.shippingPhoneNumber = true;
            }
        } else {
            this.shippingPhoneNumber = true;
        }
    }
    public checkValidDomain(domain) {
        if (domain) {
            this.domain = true;
        } else {
            this.domain = false;
        }
        if (domain && !domain.match(this.reDomain)) {
            this.domainValid = false;
        } else {
            this.domainValid = true;
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
        if (!firstName || firstName.length < 2) {
            this.firstName = false;
        } else {
            this.firstName = true;
        }
    }
    public checkValidPhoneNumber(number) {
        if (!number || number.length < 14) {
            this.phoneNumber = false;
        } else {
            this.phoneNumber = true;
        }
    }
    public isValidate(company: CompanyProfile) {
        if (!company.isUseSelectedUser && (!company.contacts[0].firstName || company.contacts[0].firstName.length < 2)) this.firstName = false;
        if (!company.name || company.name.length === 0) this.name = false;
        if (company.clientType === "") this.type = false;
        if (company.isUseSelectedUser && !company.contacts[0].id) this.user = false;
        if (!company.isUseSelectedUser && (!company.contacts[0].primaryEmail || !company.contacts[0].primaryEmail.match(this.reEmail))) this.primaryContactEmail = false;
        if (!company.addresses[0].phoneNumbers[0].number || company.addresses[0].phoneNumbers[0].number.length < 14) this.phoneNumber = false;
        if (company.addresses.length > 1 && (!company.addresses[1].phoneNumbers[0].number || company.addresses[1].phoneNumbers[0].number.length < 14)) this.shippingPhoneNumber = false;
        if (!company.domain) this.domain = false;
        if (company.domain && !company.domain.match(this.reDomain)) this.domainValid = false;
        if (company.addresses.length > 0 && company.addresses[0].locationName != undefined && company.addresses[0].locationName.length == 0) this.billindAddress = false;
        if (company.addresses.length > 1 && company.addresses[1].locationName != undefined && company.addresses[1].locationName.length == 0) this.shippingAddress = false;
        return this.name && this.type && this.primaryPhoneNumber && this.primaryContactEmail && this.phoneNumber && this.firstName && this.domain && this.domainValid && !this.domainIsExist && this.shippingPhoneNumber && this.billindAddress && this.user && this.existPrimaryContactEmail && !this.isCheckingEmail && this.shippingAddress;
    }


}