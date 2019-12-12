import { Subscriptions } from 'src/ng2/app/interfaces/user/subscriptions';
import { PhoneNumber } from 'src/ng2/class/phone-number';
import { UserAvatar } from './user-avatar';
import { ImageCropper } from '../../shared/image-cropper/class/image-cropper';

export class UserProfile {
    role: string = 'USER';
    phoneNumbers: Array<PhoneNumber> = [ new PhoneNumber('OFFICE')];
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
    public setLogo(data: ImageCropper) {
        console.log('data',data);
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
    public serCompanyId (data) {
        this.companyId = data;
    }
    public setDesignation (data) {
        this.designation = data;
    }
    public setSubscriptions ( data) {
        this.subscription = data;
    }
}