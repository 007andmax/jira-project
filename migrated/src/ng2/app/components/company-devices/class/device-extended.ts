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
    public getDataForUpdateAssetTag(value) {
        return {
            system: {
                asset_tag: value
            }
        }
    }
    public getDataForUpdateManufacturer(value) {
        return {
            system: {
                manufacturer: value
            }
        }
    }
    public getDataForUpdateModel(value) {
        return {
            system: {
                model: value
            }
        }
    }
    public getDataForUpdateArchitecture(value) {
        return {
            system: {
                architecture: value
            }
        }
    }
    public getDataForUpdateInstallDate(value) {
        return {
            system: {
                install_date: value
            }
        }
    }
    public getDataForUpdateWarranty(value) {
        return {
            system: {
                warranty: value
            }
        }
    }
    public getDataForUpdateHardware(data) {
        return {
            agentId: this.agentId,
            companyId: this.companyId,
            override: data
        }
    }
    public setHostName(data) {
        this.hostName = data;
    }
    public getDataForEditName(value) {
        return {
            agentId: this.agentId,
            companyId: this.companyId,
            newLabelValue: value
        }
    }
}