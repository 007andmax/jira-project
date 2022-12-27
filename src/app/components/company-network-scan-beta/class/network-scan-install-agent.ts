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
    public getDataForInstall(companyId, deviceIds, discoveredByAgentId) {
        return {
            login: this.credential.username,
            password: this.credential.password,
            companyId: companyId,
            deviceIds: deviceIds,
            discoveredByAgentId: discoveredByAgentId
        }
    }
}