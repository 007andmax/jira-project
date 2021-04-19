export class NetworkScanCredential {
    id: string;
    password: string = "";
    username: string;
    constructor(id, username) {
        this.id = id;
        this.username = username;
    }
    public setPassword(data) {
        this.password = data;
    }
    public setUserName(data) {
        this.username = data;
    }
    public getDataForUpdate(companyId, username, password) {
        return {
            companyId: companyId,
            description: "Agent Network Credentials",
            expiredDate: "",
            id: this.id,
            password: password,
            template: "AGENT",
            username: username,
        }
    }
}