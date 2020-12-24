export class NetworkScanSomeInfoForDevice {
    allowAgentInstall: boolean;
    domainPresent: boolean;
    masterAgentId: string;
    constructor(data) {
        this.allowAgentInstall = data.allowAgentInstall;
        this.domainPresent = data.domainPresent;
        this.masterAgentId = data.masterAgentId;

    }
}