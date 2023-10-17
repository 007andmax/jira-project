export class SuperAdminCompany {
    "id": string;
    "name": string;
    "ownerName": string;
    "ownerEmail": string;
    "phoneNumbers": Array<string> = [];
    "subdomain": string;
    "createdAt": number;
    "status": string;
    "clientCompanies": number;
    "techUsers": number;
    "devices": number;
    constructor(data) {
        for (const key in data) {
            this[key] = data[key];
        }
    }
}