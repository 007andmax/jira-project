import { UserCompany } from './user-company';
import { UserAvatar } from './user-avatar';
import { UserSubscription } from './user-subscription';
import { UserStatistic } from './user-statistic';

export class User {
    accountType: string;
    avatar: UserAvatar;
    company: UserCompany;
    contact: any;
    deletedAt: number;
    designation: string;
    firstName: string;
    id: string;
    isContact: boolean;
    isDefault: boolean;
    isEmailVerified: boolean;
    isOwner: boolean;
    lastName: string;
    myTicketUpdated: any;
    online: any;
    owner: any;
    permissions: any;
    phoneNumbers: Array<any> = [];
    primaryEmail: string;
    priority: number;
    requestToChangePassword: boolean;
    role: string;
    secondaryEmail: any;
    startPage: any;
    status: any;
    subscription: UserSubscription;
    techRole: any;
    twoFactorAuthType: string;
    userEnabled: boolean;
    userStatistic: UserStatistic;
    constructor() { }
}