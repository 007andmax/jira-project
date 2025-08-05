export class NotificationService {
    "name": string;
    "createdAt": number;
    constructor(data) {
        for (const key in data) {
            this[key] = data[key];
        }
    }
}