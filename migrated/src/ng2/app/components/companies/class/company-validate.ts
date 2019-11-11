import { CompanyProfile } from './company-profile';
import { FORMATS } from './../../../const/phone-numbers';


export class CompanyValdiate {
    name: boolean = true;
    type: boolean = true;
    firstName: boolean = true;
    primaryContactEmail: boolean = true;
    phoneNumber: boolean = true;
    reEmail = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
    constructor() { }
public resetType() {
    this.type = true;
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
        console.log('this.type',this.type);
    }
    public checkValidPhoneNumber(number) {
        if (!this.getPhoneNumberError(number)) {
            this.phoneNumber = false;
        } else {
            this.phoneNumber = true;
        }
             console.log('this.phoneNumber',this.phoneNumber);
    }
    public checkValidPrimaryEmail(primaryEmail) {
        if (!primaryEmail || !primaryEmail.match(this.reEmail)) {
            this.primaryContactEmail = false;
        } else {
            this.primaryContactEmail = true;
        }
      
             
    }
    public isValidate(company: CompanyProfile) {
        if (!company.name || company.name.length === 0) this.name = false;
        if (company.clientType === "") this.type = false;
        if (!company.contacts[0].primaryEmail || !company.contacts[0].primaryEmail.match(this.reEmail)) this.primaryContactEmail = false;
        if (!this.getPhoneNumberError(company.addresses[0].phoneNumbers[0].number)) this.phoneNumber = false;
        return this.name && this.type && this.primaryContactEmail && this.phoneNumber;

    }
    private getPhoneNumberError (number) {
        let required = false, invalid = false, minlength = false, maxlength = false;
        let error;
      
            let prefixValid = true || this.isPrefixValid(number);
            let isPrefixOnly = false && number.split(' ').length <= 1
      
console.log('prefixValid',prefixValid);


        if ((number && !prefixValid)) {
            invalid = true;
        } else if (!isPrefixOnly && number && number.length < 5) {
            minlength = true;
            error = 'Phone number is too short';
        } else if (number.length > 20) {
            maxlength = true;
            error = 'Phone number is too long';
        }

        return invalid;
    };
    private isPrefixValid(phone) {
        if (!phone || phone[0] !== '+') {
            return false;
        } else {
            let prefix = phone.split(' ')[0];

            for (let code in FORMATS) {
                let formatPrefix = FORMATS[code].prefix;

                if (formatPrefix === prefix) {
                    return true;
                }
            }

            return false;
        }
    }

}