export class SoftwareSummaryReport {
    companyId: string;
    deviceId: string;
    devices = [];
    list = [];
    softwareSummarySoft: any;
    softwareSummaryWithDevice: boolean = true;
    softwareSummaryWithSoftwareTitle: boolean = true;
    softwareSummaryWithInstalationKey: boolean = true;
    softwareSummaryWithPublisher: boolean = true;
    softwareSummaryWithVersion: boolean = true;
    softwareSummaryWithInstallDate: boolean = true;
    soft: any = [];
    preloaderSoft: boolean = false;
    isGetDevices: boolean = false;
    date = new Date();
    constructor(data = null) {
        if (data != null) {
            this.companyId = data.companyId;
            this.deviceId = data.deviceId;
            this.devices = data.devices;
            this.list = data.list;
            this.softwareSummarySoft = data.softwareSummarySoft;
            this.softwareSummaryWithDevice = data.softwareSummaryWithDevice;
            this.softwareSummaryWithSoftwareTitle = data.softwareSummaryWithSoftwareTitle;
            this.softwareSummaryWithInstalationKey = data.softwareSummaryWithInstalationKey;
            this.softwareSummaryWithPublisher = data.softwareSummaryWithPublisher;
            this.softwareSummaryWithVersion = data.softwareSummaryWithVersion;
            this.softwareSummaryWithInstallDate = data.softwareSummaryWithInstallDate;
            this.soft = data.soft;
        }

    }
    public setPreloaderSoft(data) {
        this.preloaderSoft = data;
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
    public resetSoft() {
        this.soft = [];
    }
    public addSoft(data) {
        this.soft.push(data);
    }
    public setSoftwareSoft(data) {
        this.softwareSummarySoft = data;
    }
    public setIsGetDevices(data) {
        this.isGetDevices = data;
    }
}