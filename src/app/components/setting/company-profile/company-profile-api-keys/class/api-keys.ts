export class ApiKeys {
    "id": string;
    "key": string;
    "title": string;
    "companyId": string;
    "permissions": Array<string> = [];
    constructor(data) {
        this.id = data.id || '';
        this.key = data.key || '';
        this.title = data.title || '';
        this.companyId = data.companyId || '';
        if (data.permissions && Array.isArray(data.permissions)) {
            this.permissions = data.permissions;
        }

    }
}