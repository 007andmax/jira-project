export class ValidateCustomAside {
    name: boolean = true;
    reIpAdress = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    reMacAdress = /^([0-9a-f]{1,2}){5}([0-9a-f]{1,2})$/i;
    ipAdress: boolean = true;
    macAdress: boolean = true;
    type: boolean = true;
    public getType() {
        return this.type;
    }
    public resetType() {
        this.type = true;
    }
    public resetName() {
        this.name = true;
    }
    public getName() {
        return this.name;
    }
    public checkValidName(name) {
        if (!name || name.length === 0) {
            this.name = false;
        } else {
            this.name = true;
        }
    }
    public getIpAdress() {
        return this.ipAdress;
    }
    public resetIpAdress() {
        this.ipAdress = true;
    }

    public getMacAdress() {
        return this.macAdress;
    }
    public resetMacAdress() {
        this.macAdress = true;
    }

    public isValidate(device) {
        if (!device.type) this.type = false;
        if (!device.name || device.name.length == 0) this.name = false;
        if (device.ip_address && device.ip_address.length > 0 && !device.ip_address.match(this.reIpAdress)) this.ipAdress = false;
        if (device.mac_address && device.mac_address.length > 0 && !device.mac_address.match(this.reMacAdress)) this.macAdress = false;
        return this.type && this.name && this.ipAdress && this.macAdress;

    }
}