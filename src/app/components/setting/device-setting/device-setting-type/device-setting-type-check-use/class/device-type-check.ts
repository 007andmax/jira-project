import { DeviceCompany } from "src/app/components/company-devices/class/device-company";

export class DeviceTypeCheck {
    devices: Array<DeviceCompany> = [];
    "id": string;
    "name": string;
    constructor(data) {
        for (const key in data) {
            this[key] = data[key];
        }
        if (data.devices) {
            this.devices = data.devices.map(item => new DeviceCompany(item, data.id));
        }
    }
}