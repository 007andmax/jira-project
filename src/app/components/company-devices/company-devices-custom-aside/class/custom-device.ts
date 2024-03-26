import * as moment from 'moment';

export class CustomDevice {
    "deviceId": string;
    "companyId": string;
    "name": string;
    "type": string;
    "ip_address": string
    "port": number;
    "mac_address": string;
    "manufacturerId": number;
    "modelId": number;
    "asset_tag": string;
    "install_date": string = new Date().toISOString();
    "warranty_date": string = new Date().toISOString();
    "location": string;
    "notes": string;
    "tags": [];
    constructor() { }

    public setCompanyId(data) {
        this.companyId = data;
    }
    public setType(data) {
        this.type = data;
    }
    public setManufacturerId(data) {
        this.manufacturerId = data;
    }
    public setModelId(data) {
        this.modelId = data;
    }
    public setTags(data) {
        this.tags = data;
    }
    public setInstallDate(due, currentCompany) {
        this.install_date = this.parseDateFromDatePicker(due, currentCompany);
        console.log("this.install_date", this.install_date);
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
    public setWarrentyDate(due, currentCompany) {
        this.warranty_date = this.parseDateFromDatePicker(due, currentCompany);
        console.log("this.warranty_date", this.warranty_date);
    }
    public getDataForRequest() {
        return {
            "companyId": this.companyId,
            "name": this.name,
            "type": this.type,
            "ip_address": this.ip_address,
            "port": this.port,
            "mac_address": this.mac_address,
            "manufacturerId": this.manufacturerId,
            "modelId": this.modelId,
            "asset_tag": this.asset_tag,
            "install_date": this.install_date,
            "warranty_date": this.warranty_date,
            "location": this.location,
            "notes": this.notes,
            "tags": this.tags
        }
    }
}