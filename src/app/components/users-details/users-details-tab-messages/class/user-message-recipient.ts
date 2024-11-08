import { UserAvatar } from "../../../users/class/user-avatar";

export class UserMessageRecipient {
    accountType: string;
    avatar: UserAvatar;
    email: string;
    firstName: string;
    id: string;
    lastName: string;
    constructor(data) {
        if (data) {
            for (const key in data) {
                this[key] = data[key];
            }
        }
    }
}