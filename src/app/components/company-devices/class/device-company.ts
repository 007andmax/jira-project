import { Device } from './device';

export class DeviceCompany extends Device {
    companyId: string;
    selected: boolean = false;
    isCustom: boolean;
    name: string;
    constructor(data, companyId) {
        super(data);
        this.companyId = companyId;
    }
    public getTagsNames() {
        return this.tags.map(item => item.name).join(",");
    }
    public getDataForEditIcon(iconName) {
        return {
            "agentId": this.agentId,
            "companyId": this.companyId,
            "newLabelValue": this.label,
            "iconName": iconName
        }
    }
    public getDataForRequestTags(data) {
        return {
            "devices": [
                {
                    "deviceId": this.id,
                    "tags": data
                }
            ]
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