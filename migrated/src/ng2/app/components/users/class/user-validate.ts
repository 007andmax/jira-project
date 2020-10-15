import { UserProfile } from './user-profile';

export class UserValidate {

    company: boolean = true;
    firstName: boolean = true;
    primaryContactEmail: boolean = true;
    existPrimaryContactEmail: boolean = true;
    phoneNumber: Array<boolean> = [true];
    reEmail = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
    rePhoneNumber = /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/;

    constructor() { }
    public addPhoneNumbers (phoneNumbers) {
        phoneNumbers.forEach((element,index) => {
            if (index > 0) this.addPhoneNumber();
        });
    }
    public removePhoneNumber(i) {
        this.phoneNumber.splice(i);
    }
    public addPhoneNumber() {
        this.phoneNumber.push(true);
    }
    public getCompany() {
        return this.company;
    }
    public setCompanyValid() {
        this.company = true;
    }
    public getFirstName() {
        return this.firstName;
    }
    public getPrimaryContactEmail() {
        return this.primaryContactEmail;
    }
    public getPhoneNumber(i) {
        return this.phoneNumber[i];
    }

    public checkValidFirstName(firstname) {
        if (!firstname || firstname.length < 2) {
            this.firstName = false;
        } else {
            this.firstName = true;
        }

    }
    public checkValidPhoneNumber(i, number) {
        if (this.phoneNumber.length === 1) {
            if (number.length > 0 && !number.match(this.rePhoneNumber)) { this.phoneNumber[i] = false; } else {
                this.phoneNumber[i] = true;
            }
        } else {
            if (!number.match(this.rePhoneNumber)) {
                this.phoneNumber[i] = false;
            } else {
                this.phoneNumber[i] = true;
            }
        }


    }

    public getExistPrimaryContactEmail () {
        return this.existPrimaryContactEmail;
    }
    public setExistPrimaryContactEmail (data) {
        this.existPrimaryContactEmail = data;
    }

    public checkValidPrimaryEmail(primaryEmail) {
        if (!primaryEmail || !primaryEmail.match(this.reEmail)) {
            this.primaryContactEmail = false;
        } else {
            this.primaryContactEmail = true;
        }


    }


    public isValidate(user: UserProfile) {
        let phoneNumbers = true;
        if (!user.firstName || user.firstName.length < 2) this.firstName = false;
        if (!user.companyId) this.company = false;

        if (user.primaryEmail && user.primaryEmail.length > 0 && !user.primaryEmail.match(this.reEmail)) this.primaryContactEmail = false;
        if (user.phoneNumbers.length === 1) {
            if (user.phoneNumbers[0].number.length > 0 && this.phoneNumber.includes(false)) phoneNumbers = false;
        } else {
            user.phoneNumbers.forEach((item, index) => {
                if (!item.number.match(this.rePhoneNumber)) {
                    this.phoneNumber[index] = false;
                    phoneNumbers = false;
                }
            })
        }
        return this.firstName && this.company && this.primaryContactEmail && phoneNumbers;

    }

}