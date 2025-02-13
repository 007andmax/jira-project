export class SubscriptionServicesContracts {
    "description": string;
    "type": string;
    "status": string;
    "companyName": string;
    constructor(data) {
        for (const key in data) {
            this[key] = data[key];
        }
    }
}