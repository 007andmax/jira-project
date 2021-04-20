import { CompanyValdiate } from 'src/app/components/companies/class/company-validate';
import { CompanyProfile } from 'src/app/components/companies/class/company-profile';

export class CompanyInvoiceValdiate extends CompanyValdiate {
    lastName: boolean = true;

    public getLastName() {
        return this.lastName;
    }
    public checkValidLastName(lastName) {
        if (!lastName || lastName.length === 0) {
            this.lastName = false;
        } else {
            this.lastName = true;
        }


    }
    public isValidate(company: CompanyProfile) {
        if (!company.contacts[0].firstName || company.contacts[0].firstName.length === 0) this.firstName = false;
        if (!company.name || company.name.length === 0) this.name = false;
        if (!company.contacts[0].lastName || company.contacts[0].lastName.length === 0) this.lastName = false;

        if (!company.contacts[0].primaryEmail || !company.contacts[0].primaryEmail.match(this.reEmail)) this.primaryContactEmail = false;
        if (!company.contacts[0].phoneNumbers[0].number || !company.contacts[0].phoneNumbers[0].number.match(this.rePhoneNumber)) this.phoneNumber = false;
        return this.name && this.primaryContactEmail && this.phoneNumber && this.firstName && this.lastName;

    }
}