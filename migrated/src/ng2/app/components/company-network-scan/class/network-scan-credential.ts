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
}