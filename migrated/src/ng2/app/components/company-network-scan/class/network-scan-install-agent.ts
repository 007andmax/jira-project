import { NetworkScanCredential } from "./network-scan-credential";

export class NetworkScanInstallAgent {
    credential: NetworkScanCredential;
    constructor() { }
    public setCredential(data) {
        this.credential = data;
    }
    public getCredential() {
        return this.credential;
    }
    public getCredentialText() {
        return (this.credential) ? `${this.credential.username} ${this.credential.password}` : '';
    }
}