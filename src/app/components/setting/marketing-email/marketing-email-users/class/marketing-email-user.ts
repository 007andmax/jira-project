import { UserAvatar } from "src/app/components/users/class/user-avatar";

export class MarketingEmailUsers {
    accountType: string;
    avatar: UserAvatar;
    firstName: string;
    id: string;
    lastName: string;
    constructor(data) {
        this.accountType = data.accountType;
        this.avatar = data.avatar;
        this.firstName = data.firstName;
        this.id = data.id;
        this.lastName = data.lastName;
    }
}