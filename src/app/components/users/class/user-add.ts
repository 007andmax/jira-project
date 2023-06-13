import { PhoneNumber } from 'src/class/phone-number';
import { Subscriptions } from 'src/app/interfaces/user/subscriptions';
import { UserAvatar } from './user-avatar';
import { UserProfile } from './user-profile';
import { UserCustomerCompaniesInfoAdd } from './user-customer-companies-info-add';

export class UserAdd {
  phoneNumbers: Array<PhoneNumber> = [new PhoneNumber('OFFICE')];
  subscription: Subscriptions;
  welcomeEmail: boolean = true;
  avatar: UserAvatar;
  firstName: string;
  lastName: string;
  primaryEmail: string;
  designation: string;
  companyId: string;
  jobDescription: string;
  tags: Array<any> = [];
  jobTitleId: string;
  jobTypeId: string;
  customSubscriptionIds: Array<string> = [];
  customerCompaniesInfo: Array<UserCustomerCompaniesInfoAdd> = [];
  userIndustryId: string;
  sendPortalInvitation: boolean;
  constructor(data: UserProfile) {
    if (data.phoneNumbers.length === 1 && data.phoneNumbers[0].number === '') {
      this.phoneNumbers = [];
    } else {
      this.phoneNumbers = data.phoneNumbers;
    }
    this.customSubscriptionIds = data.customSubscriptions.map(item => item.id);
    this.welcomeEmail = data.welcomeEmail;
    this.avatar = data.avatar;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.primaryEmail = data.primaryEmail;
    this.designation = data.designation;
    this.companyId = data.companyId;
    this.tags = data.tags.map(item => {
      return { id: item.id };
    })
    this.jobDescription = data.jobDescription;
    this.jobTypeId = data.jobTypeId;
    this.jobTitleId = data.jobTitleId;
    this.userIndustryId = data.userIndustryId;
    this.customerCompaniesInfo = data.customerCompaniesInfo.filter(item => item.companyId).map(item => new UserCustomerCompaniesInfoAdd(item));
    this.sendPortalInvitation = data.sendPortalInvitation;
  }
}