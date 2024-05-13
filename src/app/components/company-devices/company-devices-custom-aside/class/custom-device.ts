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
    install_date_int: number = 0;
    warranty_date_int: number = 0;
    "install_date": string;
    "warranty_date": string;
    "location": string;
    "notes": string;
    "tags": Array<any> = [];
    preloaderModels: boolean = false;
    constructor() { }

    public setCompanyId(data) {
        this.companyId = data;
    }
    public setPreloaderModels(data) {
        this.preloaderModels = data;
    }
    public getTypeToLocaleLowerCase() {
        return (this.type) ? this.type.toLocaleLowerCase() : '';
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
    public resetInstallDate() {
        this.install_date = null;
        this.install_date_int = 0;
    }
    public setInstallDate(due, currentCompany) {
        this.install_date = this.parseDateFromDatePicker(due, currentCompany);
        this.install_date_int = new Date(due).getTime();
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
    public resetWarrentyDate() {
        this.warranty_date = null;
        this.warranty_date_int = 0;
    }
    public setWarrentyDate(due, currentCompany) {
        this.warranty_date = this.parseDateFromDatePicker(due, currentCompany);
        this.warranty_date_int = new Date(due).getTime();
    }
    public getDataForRequest() {
        return {
            "companyId": this.companyId,
            "name": this.name,
            "type": this.type,
            "ipAddress": this.ip_address,
            "port": Number(this.port),
            "macAddress": this.mac_address,
            "manufacturerId": this.manufacturerId,
            "modelId": this.modelId,
            "assetTag": this.asset_tag,
            "installDate": this.install_date,
            "warrantyDate": this.warranty_date,
            "location": this.location,
            "notes": this.notes,
            "tags": this.tags.map((item: any) => {
                return {
                    id: item.id,
                    name: item.name
                }
            })
        }
    }
}