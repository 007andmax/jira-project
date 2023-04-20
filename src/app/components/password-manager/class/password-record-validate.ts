import { PasswordRecord } from "./password-record";
import { PasswordRecordAdd } from "./password-record-add";

export class PasswordRecordValidate {
    company: boolean = true;
    userName: boolean = true;
    password: boolean = true;
    linkTo: boolean = true;
    ssid: boolean = true;
    reIpAdress = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    ipAdress: boolean = true;
    authenticationKeyLen: boolean = true;
    authenticationKeyBase32: boolean = true;
    constructor() { }

    public checkAuthenticationKeyBase32(authenticationKey) {
        const isBase32 = (value: string): boolean => value.length % 8 === 0 && /^[A-Z2-7]+=*$/.test(value);
        return isBase32(authenticationKey);
    }
    public getAuthenticationKeyLen() {
        return this.authenticationKeyLen;
    }
    public resetAuthenticationKeyLen() {
        this.authenticationKeyLen = true;
    }
    public getAuthenticationKeyBase32() {
        return this.authenticationKeyBase32;
    }
    public resetAuthenticationKeyBase32() {
        this.authenticationKeyBase32 = true;
    }
    public getIpAdress() {
        return this.ipAdress;
    }
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
    public resetIpAdress() {
        this.ipAdress = true;
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
        if (record.template.name !== "WIFI_NETWORK" && (!record.userName || record.userName === "")) this.userName = false;
        if (record.template.name === "WIFI_NETWORK" && (!record.ssid || record.ssid === "")) this.ssid = false;
        if (record.template.name === "DEVICE" && record.ipAdres && record.ipAdres.length > 0 && !record.ipAdres.match(this.reIpAdress)) this.ipAdress = false;
        if ((record.template.name === "DEVICE") && selectedUserAndDevices.length === 0) this.linkTo = false;
        if (record.authenticationKey && record.authenticationKey.length > 0 && record.authenticationKey.length < 16) this.authenticationKeyLen = false;
        if (record.authenticationKey && record.authenticationKey.length > 0 && record.authenticationKey.length >= 16 && !this.checkAuthenticationKeyBase32(record.authenticationKey)) this.authenticationKeyBase32 = false;
        return this.company && this.password && this.userName && this.ssid && this.linkTo && this.ipAdress && this.authenticationKeyLen && this.authenticationKeyBase32;
    }
    public isValidateEdit(record: PasswordRecord, selectedUserAndDevices) {
        if (!record.companyId) this.company = false;
        if (record.template.name !== "WIFI_NETWORK" && (!record.username || record.username === "")) this.userName = false;
        if (record.template.name === "WIFI_NETWORK" && (!record.ssid || record.ssid === "")) this.ssid = false;
        if ((record.template.name === "DEVICE") && selectedUserAndDevices.length === 0) this.linkTo = false;
        if (record.template.name === "DEVICE" && record.ip && record.ip.length > 0 && !record.ip.match(this.reIpAdress)) this.ipAdress = false;
        if (record.authenticationKey && record.authenticationKey.length > 0 && record.authenticationKey.length < 16) this.authenticationKeyLen = false;
        if (record.authenticationKey && record.authenticationKey.length > 0 && record.authenticationKey.length >= 16 && !this.checkAuthenticationKeyBase32(record.authenticationKey)) this.authenticationKeyBase32 = false;
        return this.company && this.userName && this.ssid && this.linkTo && this.ipAdress && this.authenticationKeyLen && this.authenticationKeyBase32;
    }
}