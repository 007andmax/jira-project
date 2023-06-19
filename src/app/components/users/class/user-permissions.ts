export class UserPermissions {
    id: string;
    name: string;
    order: number;
    permissions: Array<string> = [];
    constructor(data) {
        if (data) {
            for (const key in data) {
                this[key] = data[key];
            }
        }
    }
    /**
* @description Return Object for User Permissions
* @returns  {Object} This is the result
*/
    public getDataForRequest() {
        return {
            name: this.name,
            permissions: this.permissions
        }
    }
}