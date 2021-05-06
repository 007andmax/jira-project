import { UserPhoneNumber } from './user-phone-number';
import { UserSubscription } from './user-subscription';
import { UserAvatar } from './user-avatar';
import { User } from './user';
import { UserProfile } from './user-profile';

export class UserUpdate {
  role: string;
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
  constructor(data: UserProfile, user: User) {
    this.role = data.role;


    this.phoneNumbers = data.phoneNumbers.map((item, index) => {
      if (!user.phoneNumbers || user.phoneNumbers && user.phoneNumbers.length === 0) {
        return new UserPhoneNumber(null, item.number, item.typeNumber, null);

      } else {

        return new UserPhoneNumber(user.phoneNumbers[index].id, item.number, item.typeNumber, user.phoneNumbers[index].priority);

      }
    });
    if (this.phoneNumbers.length === 1 && this.phoneNumbers[0].number === "") this.phoneNumbers = [];

    this.subscription = new UserSubscription(user.subscription.id, data.subscription.invoice, data.subscription.ticket, data.subscription.ticketManager);
    this.welcomeEmail = data.welcomeEmail;
    this.avatar = data.avatar;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.primaryEmail = data.primaryEmail;
    this.designation = data.designation;
    this.companyId = data.companyId;

    this.id = user.id;
    this.accountType = user.accountType;
    this.deletedAt = user.deletedAt;
    this.isContact = user.isContact;
    this.priority = user.priority;
    this.userEnabled = user.userEnabled;
    this.tags = data.tags.map(item => {
      return { id: item.id }
    })
    this.jobDescription = data.jobDescription;
  }
}