export class UserRole {
    "id": string;
    "name": string;
    permissions: Array<string> = [];
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.permissions = (data.permissions) ? data.permissions : [];
    }
    /**
* @description Check use permission
* @param  {String} action  - value of permission
* @returns  {Boolean} This is the result
*/
    getPermission(action) {
        return this.permissions.indexOf(action) > -1
    }
    /**
* @description Return object for request to update User Role
* @param  {Array<string>} permissions  - Array of permissions
* @returns  {Object} This is the result
*/
    public getDataForRequest(permissions) {
        return {
            name: this.name,
            permissions: permissions
        }
    }
}