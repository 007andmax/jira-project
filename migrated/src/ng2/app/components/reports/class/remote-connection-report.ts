import { RemoteConnectionReportItem } from "./remote-connection-report-item";

export class RemoteConnectionReport {
    type: string = "SUMMARY";
    companyId: string;
    deviceId: string;
    userId: string;
    startDate: string = '';
    endDate: string = '';
    preloaderDevices: boolean = false;
    clientCompanyName: string;
    lines: Array<RemoteConnectionReportItem> = [];
    techCompanyName: string;
    totalDuration: number;

    constructor(data = null) {
        if (data) {
            this.type = data.type;
            this.companyId = data.companyId;
            this.deviceId = data.deviceId;
            this.userId = data.userId;
            this.startDate = data.startDate;
            this.endDate = data.endDate;
            this.preloaderDevices = data.preloaderDevices;
            this.clientCompanyName = data.clientCompanyName;
            this.lines = data.lines;
            this.techCompanyName = data.techCompanyName;
            this.totalDuration = data.totalDuration;
        }
    }

    public setDataFromRequest(data) {
        this.clientCompanyName = data.clientCompanyName;

        this.lines = data.lines.map(item => new RemoteConnectionReportItem(item));

        this.techCompanyName = data.techCompanyName;
        this.totalDuration = data.totalDuration;

    }
    public getForRequest() {
        return {
            type: this.type,
            companyId: this.companyId,
            deviceId: this.deviceId,
            userId: this.userId,
            startDate: this.startDate,
            endDate: this.endDate,
        }
    }
    public setCompanyId(data) {
        this.companyId = data;
        if (data) {
            this.type = "DETAILED";
        } else {
            this.type = "SUMMARY";
        }
    }
    public setStartDate(data) {
        this.startDate = data;
    }
    public setEndDate(data) {
        this.endDate = data;
    }
    public resetDates() {
        this.startDate = '';
        this.endDate = '';
    }
    public setDeviceId(data) {
        this.deviceId = data;
    }
    public setTechUserId(data) {
        this.userId = data;
    }
    public setPreloaderDevices(data) {
        this.preloaderDevices = data;
    }
}