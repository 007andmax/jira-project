export class NotificationProduct {
    "description": string;
    "createdAt": number;
    constructor(data) {
        for (const key in data) {
            this[key] = data[key];
        }
    }
}