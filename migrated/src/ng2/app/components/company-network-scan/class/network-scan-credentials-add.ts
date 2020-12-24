export class NetworkScanCredentialsAdd {
    password: string = "";
    username: string = "";
    constructor() {

    }
    public isValidate() {
        return (this.password.length > 0 && this.username.length > 0)
    }
    public getDataForAdd(companyId) {
        return {
            companyId: companyId,
            description: "Agent Network Credentials",
            expiredDate: null,
            password: this.password,
            template: "AGENT",
            username: this.username
        }
    }
}