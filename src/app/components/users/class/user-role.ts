export class UserRole {
    "id": string;
    "name": string;
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
    }
    public getDataForRequest(permissions) {
        return {
            name: this.name,
            permissions: permissions
        }
    }
}