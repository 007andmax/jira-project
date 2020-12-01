import { Device } from './device';
import { DeviceExtendedReport } from './device-extended-report';

export class DeviceExtended extends Device {
    report: DeviceExtendedReport;
    companyId: string;
    constructor(data, companyId) {
        super(data);
        this.report = new DeviceExtendedReport(data.report);
        this.companyId = companyId;
    }
}