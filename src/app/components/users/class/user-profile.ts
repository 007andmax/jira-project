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

export class UserProfile {
    id: string;
    role: string = 'USER';
    phoneNumbers: Array<PhoneNumber> = [new PhoneNumber('OFFICE')];
    customSubscriptions: Array<UserCustomSubscription> = [];
    defaultSubscriptions: UserDefaultSubscription = new UserDefaultSubscription();
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
    userIndustryId: string;
    constructor() {

    }

    public setTags(data) {
        this.tags = data;
    }
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
        this.defaultSubscriptions = new UserDefaultSubscription(user.defaultSubscriptions);
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
        this.userIndustryId = user.userIndustryId;
    }
    public editLogo(data) {
        this.avatar = data;

    }
    public setLogo(data: ImageCropper) {

        this.avatar = new UserAvatar();
        this.avatar.base64 = data.croppedImage.base64;
        this.avatar.origin.id = data.id;
        this.avatar.w = data.croppedImage.width;
        this.avatar.h = data.croppedImage.width;
        this.avatar.x = data.croppedImage.imagePosition.x1;
        this.avatar.y = data.croppedImage.imagePosition.y1;

    }
    public addPhoneNumber() {
        this.phoneNumbers.push(new PhoneNumber('OFFICE'));
    }
    public setUserIndustryId(data) {
        this.userIndustryId = data;
    }
    public setRole(data) {
        this.role = data;
    }
    public setJobTitleId(data) {
        this.jobTitleId = data;
    }
    public setJobTypeId(data) {
        this.jobTypeId = data;
    }
    public getRole() {
        return this.role;
    }
    public serCompanyId(data) {
        this.companyId = data;
    }
    public setDesignation(data) {
        this.designation = data;
    }
    public setCustomSubscriptions(data) {
        this.customSubscriptions = data;
    }
    public setDefaultSubscriptions(data) {
        this.defaultSubscriptions = data;
    }
    public getUserForUpdate(user: User) {

        return new UserUpdate(this, user);
    }
    public getUserForAdd() {

        return new UserAdd(this);
    }
}