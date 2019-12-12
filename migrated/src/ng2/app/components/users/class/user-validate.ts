import { UserProfile } from './user-profile';

export class UserValidate {
   
    company: boolean = true;
    firstName: boolean = true;
    primaryContactEmail: boolean = true;
    phoneNumber: Array<boolean> = [true];
    reEmail = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
    rePhoneNumber = /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/;
     
    constructor() { }
    public addPhoneNumber() {
        this.phoneNumber.push(true);
    }
    public getCompany(){
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
        if (firstname.length === 0) {
            this.firstName = false;
        } else {
            this.firstName = true;
        }

    }
    public checkValidPhoneNumber(i,number) {
        if (!number || !number.match(this.rePhoneNumber)) {
            this.phoneNumber[i] = false;
        } else {
            this.phoneNumber[i] = true;
        }

    }
   

    public checkValidPrimaryEmail(primaryEmail) {
        if (!primaryEmail || !primaryEmail.match(this.reEmail)) {
            this.primaryContactEmail = false;
        } else {
            this.primaryContactEmail = true;
        }


    }

   
    public isValidate(user: UserProfile) {
        if (!user.firstName || user.firstName.length === 0) this.firstName = false;
        if (!user.companyId) this.company = false;
        
        if (user.primaryEmail && user.primaryEmail.length > 0 && !user.primaryEmail.match(this.reEmail)) this.primaryContactEmail = false;
        user.phoneNumbers.forEach((item,index) => {
        if (item.number.length === 0 || !item.number.match(this.rePhoneNumber)) this.phoneNumber[index] = false;
        }) 

        
       console.log('this.phoneNumber',this.phoneNumber);
       console.log('this.phoneNumber',this.phoneNumber.indexOf(false));
        return this.firstName && this.company && this.primaryContactEmail  && !this.phoneNumber.includes(false);

    }

}