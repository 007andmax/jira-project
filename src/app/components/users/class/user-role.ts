export class UserRole {
    "id": string;
    "name": string;
    permissions: Array<string> = [];
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.permissions = (data.permissions) ? data.permissions : [];
    }
    getPermission(action) {
        return this.permissions.indexOf(action) > -1
    }
    public getDataForRequest(permissions) {
        return {
            name: this.name,
            permissions: permissions
        }
    }
}