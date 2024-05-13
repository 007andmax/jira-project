export class CompanyDevicesEditIpValidate {
    reIpAdress = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    ipAdress: boolean = true;
    public getIpAdress() {
        return this.ipAdress;
    }
    public resetIpAdress() {
        this.ipAdress = true;
    }
    public checkIpAddress(ip) {
        if (ip.length > 0 && !ip.match(this.reIpAdress)) this.ipAdress = false;
        if (ip.length > 0 && ip.match(this.reIpAdress) || ip.length == 0) this.ipAdress = true;
    }
}