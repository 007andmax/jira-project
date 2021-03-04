export class DeviceIpSummary {
    companyId: string;
    deviceId: string;
    devices = [];
    list = [];
    date = new Date();
    preloaderDevices: boolean = false;

    deviceIpSummaryWithDevice = true;
    deviceIpSummaryWithNetworkName = true;
    deviceIpSummaryWithLinkSpeed = true;
    deviceIpSummaryWithDhcp = true;
    deviceIpSummaryWithIpAddress = true;
    deviceIpSummaryWithSubnet = true;
    deviceIpSummaryWithGateway = true;
    deviceIpSummaryWithDns1 = true;
    deviceIpSummaryWithDns2 = true;
    deviceIpSummaryWithWanIp = true;
    constructor(data = null) {
        if (data) {
            this.companyId = data.companyId;
            this.deviceId = data.deviceId;
            this.devices = data.devices;
            this.deviceIpSummaryWithDevice = data.deviceIpSummaryWithDevice;
            this.deviceIpSummaryWithNetworkName = data.deviceIpSummaryWithNetworkName;
            this.deviceIpSummaryWithLinkSpeed = data.deviceIpSummaryWithLinkSpeed;
            this.deviceIpSummaryWithDhcp = data.deviceIpSummaryWithDhcp;
            this.deviceIpSummaryWithIpAddress = data.deviceIpSummaryWithIpAddress;
            this.deviceIpSummaryWithSubnet = data.deviceIpSummaryWithSubnet;
            this.deviceIpSummaryWithGateway = data.deviceIpSummaryWithGateway;
            this.deviceIpSummaryWithDns1 = data.deviceIpSummaryWithDns1;
            this.deviceIpSummaryWithDns2 = data.deviceIpSummaryWithDns2;
            this.deviceIpSummaryWithWanIp = data.deviceIpSummaryWithWanIp;
            this.list = [];
        }
    }

    public setPreloaderDevices(data) {
        this.preloaderDevices = data;
    }
    public setCompanyId(data) {
        this.companyId = data;
    }
    public setDevices(data) {
        this.devices = data;
    }
    public setDeviceId(data) {
        this.deviceId = data;
    }
}