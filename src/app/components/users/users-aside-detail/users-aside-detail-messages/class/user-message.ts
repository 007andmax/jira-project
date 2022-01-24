import { UserMessageRecipient } from "./user-message-recipient";

export class UserMessage {
    createdAt: string;
    subject: string;
    type: string;
    body: string;
    emailFrom: string;
    senderName: string;
    otherRecipients: []
    recipientsFromSystem: Array<UserMessageRecipient> = [];
    constructor(data) {
        if (data) {
            for (const key in data) {
                this[key] = data[key];
            }
        }
    }
}