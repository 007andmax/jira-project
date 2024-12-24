export class SubscriptionServices {
    "id": string;
    "name": string;
    "rate": number;
    "taxes": [];
    constructor(data = null) {
        if (data) {
            for (const key in data) {
                this[key] = data[key];
            }
        }
    }
}