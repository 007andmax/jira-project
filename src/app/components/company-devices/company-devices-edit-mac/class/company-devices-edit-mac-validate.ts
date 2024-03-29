export class CompanyDevicesEditMacValidate {
    reMacAdress = /^([0-9a-f]{1,2}[\.:-]){5}([0-9a-f]{1,2})$/i;
    macAdress: boolean = true;
    public getMacAdress() {
        return this.macAdress;
    }
    public resetMacAdress() {
        this.macAdress = true;
    }
    public checkMacAddress(mac) {
        if (mac.length > 0 && !mac.match(this.reMacAdress)) this.macAdress = false;
        if (mac.length > 0 && mac.match(this.reMacAdress) || mac.length == 0) this.macAdress = true;
    }
}