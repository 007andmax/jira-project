import { Company } from "src/ng2/app/interfaces/quote/company";
import { PasswordDeviceUser } from "./password-device-user";
import { PasswordRecordCategories } from "./password-record-categories";

export class PasswordRecordAdd {
    description: string = "";
    client: Company;
    template: PasswordRecordCategories;
    ssid: string;
    userName: string;
    password: string;
    key: string;
    link: any;
    url: string;
    code: string;
    userOrDevice: any;
    ipAdres: string;
    port: string;
    expiryDate: string;
    note: string;
    https: boolean = false;
    ssh: boolean = false;
    telnet: boolean = false;
    constructor() {

    }
    public isDefaultType() {
        return this.template.default;
    }
    public setCompany(data) {
        this.client = data;
    }
    public setType(data) {
        this.template = data;
    }
    public setExpiryDate(data) {
        this.expiryDate = data;
    }
    public getExpiryDateByTime() {
        return new Date(this.expiryDate).getTime();
    }
    public getDataForAdd(selectedUserAndDevices: Array<PasswordDeviceUser>) {
        let data: any = {
            companyId: this.client.id,
            description: this.description,
            expiredDate: this.expiryDate,
            links: selectedUserAndDevices.map(item => {
                if (item.type === "DEVICE") return { deviceId: item.id }
                if (item.type === "USER") return { userId: item.id }
                if (item.type === "GADGET") return { gadgetId: item.id }
            }),

            password: this.password,
            template: this.template
        };
        if (this.template.name === "OFFICE_365_ACCOUNT" || !this.isDefaultType()) {
            data.key = this.key;
            data.url = this.url;
            data.ssid = this.ssid;
            data.username = this.userName;
            data.note = this.note;
        }
        if (this.template.name === "MICROSOFT_ACCOUNT") {
            data.url = this.url;
            data.username = this.userName;
            data.note = this.note;
        }
        if (this.template.name === "EMAIL_ACCOUNT") {
            data.username = this.userName;
            data.note = this.note;
        }
        if (this.template.name === "HOSTING") {
            data.url = this.url;
            data.username = this.userName;
            data.note = this.note;
        }
        if (this.template.name === "DEVICE") {
            data.ip = (this.ipAdres) ? this.ipAdres : null;
            data.username = this.userName;
            data.https = this.https;
            data.ssh = this.ssh;
            data.telnet = this.telnet;
            data.port = this.port;
            data.note = this.note;
        }
        if (this.template.name === "GENERIC") {
            data.username = this.userName;
            data.code = this.code;
            data.note = this.note;
        }
        if (this.template.name === "AGENT") {
            data.username = this.userName;
        }
        if (this.template.name === "WIFI_NETWORK") {
            data.ssid = this.ssid;
            data.note = this.note;
        }
        if (this.template.name === "LOCAL_USER_ACCOUNT") {
            data.username = this.userName;
            data.note = this.note;
        }
        return data;
    }
}