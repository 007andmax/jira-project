import { PasswordRecordCategories } from "../../password-manager/class/password-record-categories";

export class NetworkScanCredentialsAdd {
    password: string = "";
    username: string = "";
    constructor() {

    }
    public isValidate() {
        return (this.password.length > 0 && this.username.length > 0)
    }
    public getDataForAdd(companyId, categoryAgent: PasswordRecordCategories) {
        return {
            companyId: companyId,
            description: "Agent Network Credentials",
            expiredDate: null,
            password: this.password,
            template: { "id": categoryAgent.id, "name": "AGENT", "default": true, "title": "Agent" },
            username: this.username
        }
    }
}