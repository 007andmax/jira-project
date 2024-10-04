import { UserCompany } from './user-company';
import { UserAvatar } from './user-avatar';
import { UserSubscription } from './user-subscription';
import { UserStatistic } from './user-statistic';
import { ImageCropper } from '../../shared/image-cropper/class/image-cropper';
import { Tag } from 'src/app/interfaces/tag/tag';
import { UserDefaultSubscription } from './user-default-subscription';
import { UserCustomSubscription } from './user-custom-subscription';
import { UserEmailNotifications } from './user-email-notification';
import { UserCustomerCompaniesInfo } from './user-customer-companies-info';

export class User {
    accountType: string;
    avatar: UserAvatar;
    company: UserCompany;
    portalAccessStatus: string;
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
    permissions: Array<string> = [];
    phoneNumbers: Array<any> = [];
    primaryEmail: string;
    priority: number;
    requestToChangePassword: boolean;
    role: string;
    secondaryEmail: any;
    startPage: any;
    status: any;
    customSubscriptions: Array<UserCustomSubscription>;
    techRole: any;
    twoFactorAuthType: string;
    userEnabled: boolean;
    userStatistic: UserStatistic;
    selected: boolean = false;
    tags: Array<Tag> = [];
    jobDescription: string;
    jobTitleId: string;
    jobTypeId: string;
    userEmailNotifications: UserEmailNotifications;
    customerCompaniesInfo: Array<UserCustomerCompaniesInfo> = [];
    constructor(data = null) {
        if (data) {
            for (const key in data) {
                this[key] = data[key];
            }
            this.customSubscriptions = data.customSubscriptions.map(item => new UserCustomSubscription(item));
            this.userEmailNotifications = new UserEmailNotifications(data.userEmailNotifications);
            this.customerCompaniesInfo = (data.customerCompaniesInfo) ? data.customerCompaniesInfo.map(item => new UserCustomerCompaniesInfo(item)) : [];
            this.customerCompaniesInfo.sort((a, b) => (a.clientCompanyName.toLowerCase() > b.clientCompanyName.toLowerCase()) ?
                1 : ((b.clientCompanyName.toLowerCase() > a.clientCompanyName.toLowerCase()) ? -1 : 0))
            this.permissions = (data.permissions) ? data.permissions : [];

        }

    }
    /**
    * @description Return list for Email Notifications, if fields are true
    * @returns {Array<string>} This is the result
 */
    public getVisibleListUserEmailForTechusers() {
        let list = ["New Device", "New ticket", "Ticket Updated", "Ticket Closed"];
        let outList = [];
        if (this.userEmailNotifications) {
            if (this.userEmailNotifications.newDevice) outList.push(list[0]);
            if (this.userEmailNotifications.ticketCreated) outList.push(list[1]);
            if (this.userEmailNotifications.myTicketUpdated) outList.push(list[2]);
            if (this.userEmailNotifications.ticketCloseNotifications) outList.push(list[3]);
        }
        return outList;
    }
    /**
   * @description Return list for Tooltips, if fields are true
   * @returns {Array<string>} This is the result
*/
    public getTooltipsListUserEmailForTechusers() {
        let list = ["When my account is logged in from a new device",
            "When a New Ticket created",
            "When a ticket that is assigned to me is updated",
            "When any ticket is closed"];
        let outList = [];
        if (this.userEmailNotifications.newDevice) outList.push(list[0]);
        if (this.userEmailNotifications.ticketCreated) outList.push(list[1]);
        if (this.userEmailNotifications.myTicketUpdated) outList.push(list[2]);
        if (this.userEmailNotifications.ticketCloseNotifications) outList.push(list[3]);
        return outList;
    }
    /**
* @description Update data of User
* @param {Object} data - Object of User 
*/
    public onUpdate(data) {
        for (const key in data) {
            this[key] = data[key];
        }
        this.customSubscriptions = data.customSubscriptions.map(item => new UserCustomSubscription(item));
        this.customerCompaniesInfo = data.customerCompaniesInfo.map(item => new UserCustomerCompaniesInfo(item));
        this.customerCompaniesInfo.sort((a, b) => (a.clientCompanyName.toLowerCase() > b.clientCompanyName.toLowerCase()) ?
            1 : ((b.clientCompanyName.toLowerCase() > a.clientCompanyName.toLowerCase()) ? -1 : 0))
    }
    /**
  * @description Set list Custom Subscriptions
  * @param {Array<UserCustomSubscription>} data - Array Objects Custom Subscriptions 
*/
    public changeCustomSubscriptions(data) {
        this.customSubscriptions = data;
    }
}