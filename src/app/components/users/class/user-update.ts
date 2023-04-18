import { UserPhoneNumber } from './user-phone-number';
import { UserSubscription } from './user-subscription';
import { UserAvatar } from './user-avatar';
import { User } from './user';
import { UserProfile } from './user-profile';
import { UserDefaultSubscriptionAdd } from './user-default-subscription-add';
import { UserCustomerCompaniesInfo } from './user-customer-companies-info';
import { UserCustomerCompaniesInfoAdd } from './user-customer-companies-info-add';

export class UserUpdate {
  phoneNumbers: Array<UserPhoneNumber>;
  subscription: UserSubscription;
  welcomeEmail: boolean = true;
  avatar: UserAvatar;
  firstName: string;
  lastName: string;
  primaryEmail: string;
  designation: string;
  companyId: string;
  id: string;
  accountType: string;
  deletedAt: number;
  isContact: boolean;
  priority: number;
  userEnabled: boolean;
  tags: Array<any> = [];
  jobDescription: string;
  jobTypeId: string;
  customSubscriptionIds: Array<string> = [];
  customerCompaniesInfo: Array<UserCustomerCompaniesInfoAdd> = [];
  userIndustryId: string;
  constructor(data: UserProfile, user: User) {
    this.phoneNumbers = data.phoneNumbers.map((item, index) => {
      if (!user.phoneNumbers || user.phoneNumbers && user.phoneNumbers.length === 0) {
        return new UserPhoneNumber(null, item.number, item.typeNumber, null);
      } else {
        if (user.phoneNumbers.length <= index) return new UserPhoneNumber(null, item.number, item.typeNumber, null);
        return new UserPhoneNumber(user.phoneNumbers[index].id, item.number, item.typeNumber, user.phoneNumbers[index].priority);
      }
    });
    if (this.phoneNumbers.length === 1 && this.phoneNumbers[0].number === "") this.phoneNumbers = [];
    this.welcomeEmail = data.welcomeEmail;
    this.tags = data.tags.map(item => {
      return { id: item.id }
    })
    this.customSubscriptionIds = data.customSubscriptions.map(item => item.id);
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.primaryEmail = data.primaryEmail;
    this.avatar = data.avatar;
    this.designation = data.designation;
    this.companyId = data.companyId;
    this.id = user.id;
    this.accountType = user.accountType;
    this.deletedAt = user.deletedAt;
    this.isContact = user.isContact;
    this.priority = user.priority;
    this.userEnabled = user.userEnabled;

    this.jobDescription = data.jobDescription;
    this.jobTypeId = data.jobTypeId;
    this.userIndustryId = data.userIndustryId;
    this.customerCompaniesInfo = data.customerCompaniesInfo.filter(item => item.companyId).map(item => new UserCustomerCompaniesInfoAdd(item));
  }
}