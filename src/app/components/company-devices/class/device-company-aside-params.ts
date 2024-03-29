import { DeviceCompany } from "./device-company";

export class DeviceCompanyAsideParams {
    type: string;
    devices: Array<DeviceCompany>;
    constructor(type, devices) {
        this.type = type;
        this.devices = devices;
    }
}