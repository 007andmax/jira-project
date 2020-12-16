export class NetworkScanDevice {
    agentStatus: string;
    createdAt: string;
    description: string;
    deviceId: string;
    discoveredByAgentId: string;
    hostName: string;
    id: string;
    ipAddress: string;
    macAddress: string;
    manufacturer: string;
    message: string;
    updatedAt: string;
    agentPassword: any;
    constructor(data) {
        for (const key in data) {
            this[key] = data[key];
        }
    }
    public setMessage(data) {
        this.message = data;
    }
    public setDescription(data) {
        this.description = data;
    }
    public setAgentPassword(data) {
        this.agentPassword = data;
    }
    public setAgentStatus(data) {
        this.agentStatus = data;
    }
    public update(data) {
        this.agentStatus = data.agentStatus;
        this.createdAt = data.createdAt;
        this.description = data.description;
        this.deviceId = data.deviceId;
        this.discoveredByAgentId = data.discoveredByAgentId;
        this.hostName = data.hostName;
        this.id = data.id;
        this.ipAddress = data.ipAddress;
        this.macAddress = data.macAddress;
        this.manufacturer = data.manufacturer;
        this.message = data.message;
        this.updatedAt = data.updatedAt;
    }
}