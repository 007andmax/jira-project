import { Subscriptions } from 'src/app/interfaces/user/subscriptions';
import { PhoneNumber } from 'src/class/phone-number';
import { UserAvatar } from './user-avatar';
import { ImageCropper } from '../../shared/image-cropper/class/image-cropper';
import { User } from './user';
import { UserUpdate } from './user-update';
import { UserAdd } from './user-add';
import { Tag } from 'src/app/interfaces/tag/tag';
import { UserCustomSubscription } from './user-custom-subscription';
import { UserDefaultSubscription } from './user-default-subscription';
import { UserCustomerCompaniesInfo } from './user-customer-companies-info';
import { MODE_EDIT_SUBSCRIPTION, MODE_HIDE_ACTIVE } from 'src/app/const/users';

export class UserProfile {
    id: string;
    role: string = 'USER';
    phoneNumbers: Array<PhoneNumber> = [new PhoneNumber('OFFICE')];
    customSubscriptions: Array<UserCustomSubscription> = [];
    customerCompaniesInfo: Array<UserCustomerCompaniesInfo> = [];
    welcomeEmail: boolean = true;
    avatar: UserAvatar;
    firstName: string;
    lastName: string;
    primaryEmail: string;
    designation: string;
    companyId: string;
    tags: Array<Tag> = [];
    jobDescription: string;
    jobTitleId: string;
    jobTypeId: string;
    sendPortalInvitation: boolean = false;
    portalAccessStatus: string;
    deletedAt: number;
    constructor() {

    }
    public isArchive() {
        return this.deletedAt != null;
    }
    public setPortalAccessStatus(data) {
        this.portalAccessStatus = data;
    }
    /**
* @description Add new element to array ojects customerCompaniesInfo
*/
    public addCustomerCompaniesInfo() {
        let customerCompaniesInfo = new UserCustomerCompaniesInfo();
        customerCompaniesInfo.setDefaultSubscriptionsForAddUser();
        this.customerCompaniesInfo.unshift(customerCompaniesInfo);
    }
    /**
* @description Set Custom Subscriptions
* @param  {Array<UserCustomSubscription>} data  - Array Objects of Custom Subscriptions
*/
    public changeCustomSubscriptions(data) {
        this.customSubscriptions = data;
    }
    /**
* @description Set Tags
* @param  {Array<Tag>} data  - Array Objects of tags
*/
    public setTags(data) {
        this.tags = data;
    }
    /**
* @description Update data from User Object
* @param  {User} user  - Object of User
*/
    public onEdit(user: User) {
        this.id = user.id;
        this.role = user.role;
        if (user.phoneNumbers && user.phoneNumbers.length === 0 || !user.phoneNumbers) {
            this.phoneNumbers = [new PhoneNumber('OFFICE')];
        } else {
            this.phoneNumbers = user.phoneNumbers.map((item) => {
                let number = item.number;
                if (number[0] === "1") number = `+${number}`;
                return new PhoneNumber(item.typeNumber, number);
            })
        }
        this.customSubscriptions = user.customSubscriptions.map(item => new UserCustomSubscription(item));
        this.welcomeEmail = user.isEmailVerified;
        this.avatar = user.avatar;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.primaryEmail = user.primaryEmail;
        this.designation = user.designation;
        this.companyId = user.company.id;
        this.tags = user.tags;
        this.jobDescription = user.jobDescription;
        this.jobTitleId = user.jobTitleId;
        this.jobTypeId = user.jobTypeId;
        this.customerCompaniesInfo = user.customerCompaniesInfo;
        this.portalAccessStatus = user.portalAccessStatus;
        this.deletedAt = user.deletedAt;
    }
    /**
* @description Return collab firstName and lastName
*/
    public getUserName() {
        return `${this.firstName} ${this.lastName}`
    }

    /**
* @description Set avatar
* @param  {UserAvatar} data  - Object of UserAvatar
*/
    public editLogo(data) {
        this.avatar = data;

    }
    /**
* @description Set new values fields object avatar
* @param  {ImageCropper} data  - Object of ImageCropper
*/
    public setLogo(data: ImageCropper) {

        this.avatar = new UserAvatar();
        this.avatar.base64 = data.croppedImage.base64;
        this.avatar.origin.id = data.id;
        this.avatar.w = data.croppedImage.width;
        this.avatar.h = data.croppedImage.width;
        this.avatar.x = data.croppedImage.imagePosition.x1;
        this.avatar.y = data.croppedImage.imagePosition.y1;

    }
    /**
* @description Add new value to array phoneNumbers by type 'OFFICE'
*/
    public addPhoneNumber() {
        this.phoneNumbers.push(new PhoneNumber('OFFICE'));
    }
    /**
* @description Set role
* @param  {string} data  - Value of role
*/
    public setRole(data) {
        this.role = data;
    }
    /**
* @description Set jobTitleId
* @param  {string} data  - Value of jobTitleId
*/
    public setJobTitleId(data) {
        this.jobTitleId = data;
    }
    /**
* @description Set jobTypeId
* @param  {string} data  - Value of jobTypeId
*/
    public setJobTypeId(data) {
        this.jobTypeId = data;
    }
    /**
* @description Return object of role
* @returns  {string} This is the result
*/
    public getRole() {
        return this.role;
    }
    /**
* @description Set companyId
* @param  {string} data  - Value of companyId
*/
    public setCompanyId(data) {
        this.companyId = data;
    }
    /**
* @description Set designation
* @param  {string} data  - Value of designation
*/
    public setDesignation(data) {
        this.designation = data;
    }
    /**
* @description Set Custom Subscriptions
* @param  {Array<UserCustomSubscription>} data  - Array objects of Custom Subscriptions
*/
    public setCustomSubscriptions(data) {
        this.customSubscriptions = data;
    }
    /**
* @description Return object of User Update, where get part data from User object
* @param  {User} user  - Object of User
* @returns  {UserUpdate} This is the result
*/
    public getUserForUpdate(user: User) {

        return new UserUpdate(this, user);
    }
    /**
* @description Return object of User Add, where get part data from User object
* @returns  {UserAdd} This is the result
*/
    public getUserForAdd() {

        return new UserAdd(this);
    }
}