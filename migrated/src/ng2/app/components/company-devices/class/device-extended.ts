import { Device } from './device';
import { DeviceExtendedReport } from './device-extended-report';

export class DeviceExtended extends Device {
    report: DeviceExtendedReport;
    constructor(data) {
        super(data);
        this.report = new DeviceExtendedReport(data.report);
    }
}