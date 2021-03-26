import { PasswordRecordAdd } from "./password-record-add";

export class PasswordRecordValidate {
    company: boolean = true;
    userName: boolean = true;
    password: boolean = true;
    linkTo: boolean = true;
    ssid: boolean = true;

    constructor() { }

    public getCompany() {
        return this.company;
    }
    public getUserName() {
        return this.userName;
    }
    public getPassword() {
        return this.password;
    }
    public getLinkTo() {
        return this.linkTo;
    }
    public getSsid() {
        return this.ssid;
    }
    public resetCompany() {
        this.company = true;
    }
    public resetUserName() {
        this.userName = true;
    }
    public resetPassword() {
        this.password = true;
    }
    public resetLinkTo() {
        this.linkTo = true;
    }
    public resetSsid() {
        this.ssid = true;
    }



    public isValidate(record: PasswordRecordAdd) {
        if (!record.client) this.company = false;
        if (!record.password || record.password === "") this.password = false;
        if (record.type !== "WIFI_NETWORK" && (!record.userName || record.userName === "")) this.userName = false;
        if (record.type === "WIFI_NETWORK" && (!record.ssid || record.ssid === "")) this.ssid = false;

        return this.company && this.password && this.userName && this.ssid;

    }
}