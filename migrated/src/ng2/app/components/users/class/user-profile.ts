import { Subscriptions } from 'src/ng2/app/interfaces/user/subscriptions';
import { PhoneNumber } from 'src/ng2/class/phone-number';
import { UserAvatar } from './user-avatar';
import { ImageCropper } from '../../shared/image-cropper/class/image-cropper';
import { User } from './user';
import { UserUpdate } from './user-update';

export class UserProfile {
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

    constructor() {
        this.subscription = {
            invoice: false, ticket: true, ticketManager: false
        }
    }
    public onEdit(user: User) {
        this.role = user.role;
        if (user.phoneNumbers.length === 0)
        {
            this.phoneNumbers = [new PhoneNumber('OFFICE')];
        } else {
            this.phoneNumbers = user.phoneNumbers.map((item) => {
                return new PhoneNumber(item.typeNumber, item.number);
            })
        }
      

        this.subscription = {
            invoice: user.subscription.invoice, ticket: user.subscription.ticket, ticketManager: user.subscription.ticketManager
        }
        this.welcomeEmail = user.isEmailVerified;
        this.avatar = user.avatar;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.primaryEmail = user.primaryEmail;
        this.designation = user.designation;
        this.companyId = user.company.id;

    }
    public editLogo (data) {
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
    public setRole(data) {
        this.role = data;
    }
    public serCompanyId(data) {
        this.companyId = data;
    }
    public setDesignation(data) {
        this.designation = data;
    }
    public setSubscriptions(data) {
        this.subscription = data;
    }
    public getUserForUpdate(user: User) {
       
        return new UserUpdate(this, user);
    }
}