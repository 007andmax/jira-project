import { PhoneNumber } from 'src/ng2/class/phone-number';

import { Subscriptions } from 'src/ng2/app/interfaces/user/subscriptions';

import { UserAvatar } from './user-avatar';
import { UserProfile } from './user-profile';

export class UserAdd {
    role: string = 'USER';
    phoneNumbers: Array<PhoneNumber> = [new PhoneNumber('OFFICE')];
    subscription: Subscriptions;
    welcomeEmail: boolean = true;
    avatar: UserAvatar;
    firstName: string;
    lastName: string;
    primaryEmail: string;
    designation: string;
    companyId: string;
    
    constructor (data:UserProfile) {
        this.role = data.role;
        if (data.phoneNumbers.length === 1 && data.phoneNumbers[0].number === ''){
            this.phoneNumbers = [];
      
          } else {
            this.phoneNumbers = data.phoneNumbers;
          }
      
        this.subscription = data.subscription;
        this.welcomeEmail = data.welcomeEmail;
        this.avatar = data.avatar;
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.primaryEmail = data.primaryEmail;
        this.designation = data.designation;
        this.companyId = data.companyId;
    
      
    }
}