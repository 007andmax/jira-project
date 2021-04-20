import { Device } from './device';

export class DeviceCompany extends Device {
    companyId: string;
    selected: boolean = false;
    constructor(data, companyId) {
        super(data);
        this.companyId = companyId;
    }
    public getDataForEditIcon(iconName) {
        return {
            "agentId": this.agentId,
            "companyId": this.companyId,
            "newLabelValue": this.label,
            "iconName": iconName
        }
    }
    public getDataForEditLabel(label) {
        return {
            "agentId": this.agentId,
            "companyId": this.companyId,
            "newLabelValue": label,
            "iconName": this.iconName
        }
    }
}