import { UserProfile } from './user-profile';

export class UserValidate {

    companies: Array<boolean> = [];
    firstName: boolean = true;
    primaryContactEmail: boolean = true;
    existPrimaryContactEmail: boolean = true;
    phoneNumber: Array<boolean> = [true];
    reEmail = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
    rePhoneNumber = /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/;

    constructor() { }

    public initCompanies(customerCompaniesInfo) {
        customerCompaniesInfo.forEach(item => (this.companies.push(true)));
    }
    public addCompany() {
        this.companies.unshift(true);
    }
    public removeCompany(i) {
        this.companies.splice(i, 1);
    }

    /**
 * @description Check, if index of Array "phoneNumbers" > 0, when init logic add new elements to Array "phoneNumber"
 * @param  {Array<boolean>} phoneNumbers  - Array of Boolean
 */
    public addPhoneNumbers(phoneNumbers) {
        phoneNumbers.forEach((element, index) => {
            if (index > 0) this.addPhoneNumber();
        });
    }
    /**
* @description Remove element from "phoneNumber" by index
* @param  {Number} i  - index for remove
*/
    public removePhoneNumber(i) {
        this.phoneNumber.splice(i);
    }
    /**
* @description Init logic add new element to array "phoneNumber"
*/
    public addPhoneNumber() {
        this.phoneNumber.push(true);
    }
    /**
* @description Return value of "company"
* @returns {boolean} This is the result
*/
    public getCompany(i) {
        return this.companies[i];
    }
    /**
* @description Reset value of "company"
*/
    public setCompanyValid(i) {
        this.companies[i] = true;
    }
    /**
* @description Return value of "firstName"
* @returns {boolean} This is the result
*/
    public getFirstName() {
        return this.firstName;
    }
    /**
* @description Return value of "primaryContactEmail"
* @returns {boolean} This is the result
*/
    public getPrimaryContactEmail() {
        return this.primaryContactEmail;
    }
    /**
* @description Return value of element "phoneNumber"  by index
* @param  {Number} i  - index element
* @returns {boolean} This is the result
*/
    public getPhoneNumber(i) {
        return this.phoneNumber[i];
    }
    /**
    * @description Check valid field "firstname"
    * @param  {string} firstname  - value First Name
    */
    public checkValidFirstName(firstname) {
        if (!firstname || firstname.length < 2) {
            this.firstName = false;
        } else {
            this.firstName = true;
        }
    }
    /**
    * @description Check valid phone number
    * @param  {number} i  - index "phoneNumber"
    * @param  {string} number  - value of phone number
    */
    public checkValidPhoneNumber(i, number) {
        if (this.phoneNumber.length === 1) {
            if (number.length > 0 && number.length < 14) { this.phoneNumber[i] = false; } else {
                this.phoneNumber[i] = true;
            }
        } else {
            if (number.length < 14) {
                this.phoneNumber[i] = false;
            } else {
                this.phoneNumber[i] = true;
            }
        }
    }
    /**
    * @description Return value of "existPrimaryContactEmail"
    * @returns {boolean} This is the result
    */
    public getExistPrimaryContactEmail() {
        return this.existPrimaryContactEmail;
    }
    /**
    * @description Set new value of "existPrimaryContactEmail"
    * @param  {boolean} data  - new value
    */
    public setExistPrimaryContactEmail(data) {
        this.existPrimaryContactEmail = data;
    }
    /**
    * @description Check valid "primaryEmail"
    * @param  {string} primaryEmail  - value of "primaryEmail"
    */
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
        user.customerCompaniesInfo.forEach((item, index) => {
            if (!item.companyId) this.companies[index] = false;
        })
        if (user.primaryEmail && user.primaryEmail.length > 0 && !user.primaryEmail.match(this.reEmail)) this.primaryContactEmail = false;
        if (user.phoneNumbers.length === 1) {
            if (user.phoneNumbers[0].number.length > 0 && user.phoneNumbers[0].number.length < 14) phoneNumbers = false;
        } else {
            user.phoneNumbers.forEach((item, index) => {
                if (item.number.length < 14) {
                    this.phoneNumber[index] = false;
                    phoneNumbers = false;
                }
            })
        }
        return this.firstName && !this.companies.some(item => !item) && this.primaryContactEmail && phoneNumbers;

    }

}