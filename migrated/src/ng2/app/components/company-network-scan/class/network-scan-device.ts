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
    constructor(data) {
        for (const key in data) {
            this[key] = data[key];
        }
    }
}