import { PasswordRecord } from "./password-record";
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



    public isValidate(record: PasswordRecordAdd, selectedUserAndDevices) {
        if (!record.client) this.company = false;
        if (!record.password || record.password === "") this.password = false;
        if (record.type !== "WIFI_NETWORK" && (!record.userName || record.userName === "")) this.userName = false;
        if (record.type === "WIFI_NETWORK" && (!record.ssid || record.ssid === "")) this.ssid = false;

        if ((record.type === "DEVICE" || record.type === "LOCAL_USER_ACCOUNT") && selectedUserAndDevices.length === 0) this.linkTo = false;


        return this.company && this.password && this.userName && this.ssid && this.linkTo;

    }
    public isValidateEdit(record: PasswordRecord, selectedUserAndDevices) {
        if (!record.companyId) this.company = false;
        if (!record.password || record.password === "") this.password = false;
        if (record.template !== "WIFI_NETWORK" && (!record.username || record.username === "")) this.userName = false;
        if (record.template === "WIFI_NETWORK" && (!record.ssid || record.ssid === "")) this.ssid = false;
        if ((record.template === "DEVICE" || record.template === "LOCAL_USER_ACCOUNT") && selectedUserAndDevices.length === 0) this.linkTo = false;

        return this.company && this.password && this.userName && this.ssid && this.linkTo;

    }
}