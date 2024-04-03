import { Device } from './device';
import * as moment from 'moment';


export class DeviceCompany extends Device {
    companyId: string;
    deviceId: string;
    selected: boolean = false;
    isCustom: boolean;
    name: string;
    installDate: string;
    installDateInt: number = 0;
    warrantyDate: string;
    warrantyDateInt: number = 0;
    assetTag: string = "";
    location: string = "";
    note: string = "";
    port: string = "";
    constructor(data, companyId) {
        super(data);
        this.companyId = companyId;
        if (this.installDate) this.installDateInt = new Date(this.installDate).getTime();
        if (this.warrantyDate) this.warrantyDateInt = new Date(this.warrantyDate).getTime();
    }
    public getTagsNames() {
        return this.tags.map(item => item.name).join(",");
    }
    public setIp(data) {
        this.ip = data;
    }
    public setPort(data) {
        this.port = data;
    }
    public setLocation(data) {
        this.location = data;
    }
    parseDateFromDatePicker(due, currentCompany) {
        let date = new Date(due); // timestamp from calendar	
        let timeOffset = currentCompany.addresses[0].timeZone.timeOffset;
        let current = new Date();
        if (date.getDate() !== current.getDate() || current.getMonth() !== date.getMonth()) {
            let dateDatePicker = new Date(due).getTime(); // timestamp from calendar	
            let finalDate = new Date(dateDatePicker - (current.getTimezoneOffset() * 60000/* dont touch*/) - timeOffset /* timezone.timeOffset */);
            return `${moment(finalDate).format('YYYY-MM-DD hh:mm:ss')}`;
        } else {
            let currentTime = new Date(current.getFullYear(), current.getMonth(), current.getDate()).getTime();
            let finalDate = new Date(currentTime - (current.getTimezoneOffset() * 60000) - timeOffset);
            return `${moment(finalDate).format('YYYY-MM-DD hh:mm:ss')}`;
        }
    }
    public setInstallDate(due, currentCompany) {
        this.installDate = this.parseDateFromDatePicker(due, currentCompany);
        this.installDateInt = new Date(due).getTime();
        console.log("this.installDate", this.installDate);
    }
    public setWarrentyDate(due, currentCompany) {
        this.warrantyDate = this.parseDateFromDatePicker(due, currentCompany);
        this.warrantyDateInt = new Date(due).getTime();
        console.log("this.warrantyDate", this.warrantyDate);
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
    public getDataForRequestField(field, value) {
        return {
            "deviceId": this.deviceId,
            "companyId": this.companyId,
            [field]: value
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