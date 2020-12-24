import { NetworkScanDevice } from "./network-scan-device";

export class NetworkScanDevices {
    companyId: string;
    devices: Array<NetworkScanDevice> = []
    lastScanDate: string;
    netScanStatus: string;
    constructor(data) {
        this.companyId = data.companyId;
        this.devices = data.devices.map(item => new NetworkScanDevice(item));
        this.lastScanDate = data.lastScanDate;
        this.netScanStatus = data.netScanStatus;
    }
}