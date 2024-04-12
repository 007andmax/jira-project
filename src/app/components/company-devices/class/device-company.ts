import { ManufactureDevice } from '../company-devices-custom-aside/class/manufacture-device';
import { ModelDevice } from '../company-devices-custom-aside/class/model-device';
import { Device } from './device';
import * as moment from 'moment';


export class DeviceCompany extends Device {
    companyId: string;
    deviceId: string;
    selected: boolean = false;
    isCustom: boolean;
    name: string;
    type: string;
    macAddress: string;
    installDate: string;
    installDateInt: number = 0;
    warrantyDate: string;
    warrantyDateInt: number = 0;
    manufacturer: ManufactureDevice;
    model: ModelDevice;
    assetTag: string = "";
    location: string = "";
    notes: string = "";
    port: string = "";
    constructor(data, companyId) {
        super(data);
        for (const key in data) {
            this[key] = data[key];
        }
        this.companyId = companyId;
        if (this.installDate) this.installDateInt = new Date(this.installDate).getTime();
        if (this.warrantyDate) this.warrantyDateInt = new Date(this.warrantyDate).getTime();
        if (data.manufacturer) this.manufacturer = new ManufactureDevice(data.manufacturer);
        if (data.model) this.model = new ModelDevice(data.model);
        if (!this.isCustom && data.iconName) this.iconName = data.iconName.toLowerCase();
    }
    public update(data) {
        for (const key in data) {
            this[key] = data[key];
        }
    }
    public setAssetTag(data) {
        this.assetTag = data;
    }
    public setType(data) {
        this.type = data;
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
    public setManufacturer(data) {
        this.manufacturer = data;
    }
    public setModel(data) {
        this.model = data;
    }
    public setName(data) {
        this.name = data;
    }
    getLabelForEdit() {
        if (this.isCustom) return this.name;
        if (this.label) return this.label;
        return this.hostName || this.ip;
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
    public getFieldForCheckIcon() {
        if (!this.isCustom) return this.iconName;
        if (this.isCustom) return this.type;
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
    public getRequestForEdit() {
        return {
            "deviceId": this.deviceId,
            "name": this.name,
            "type": this.type,
            "ipAddress": this.ip,
            "port": this.port,
            "macAddress": this.macAddress,
            "manufacturerId": this.manufacturer ? this.manufacturer.id : null,
            "modelId": this.model ? this.model.id : null,
            "assetTag": this.assetTag,
            "installDate": this.installDate,
            "warrantyDate": this.warrantyDate,
            "location": this.location,
            "notes": this.notes,
            "tags": this.tags,
        }
    }
    public getDataForRequestField(field, value) {
        let data: any = {
            "deviceId": this.deviceId,
        }
        if (field != "name") data.name = this.name;
        if (field != "type") data.type = this.type;
        if (field == "modelId") data.manufacturerId = this.manufacturer.id;
        return {
            ...data,
            [field]: value,
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