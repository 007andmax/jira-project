export class RemoteConnectionReportItem {
    companyName: string;
    date: string;
    deviceName: string;
    duration: number;
    startTime: string;
    techFullName: string;
    ticketNumber: string;
    viewerIp: string;
    constructor(data) {
        this.companyName = data.companyName;
        this.date = data.date;
        this.deviceName = data.deviceName;
        this.duration = data.duration;
        this.startTime = data.startTime;
        this.techFullName = data.techFullName;
        this.ticketNumber = data.ticketNumber;
        this.viewerIp = data.viewerIp;
    }
}