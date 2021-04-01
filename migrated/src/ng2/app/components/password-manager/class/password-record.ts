import { PasswordDeviceUser } from "./password-device-user";
import { PasswordRecordCategories } from "./password-record-categories";
import { PasswordRecordHistory } from "./password-record-history";
import { PasswordRecordLink } from "./password-record-link";

export class PasswordRecord {
    companyId: string;
    companyName: string;
    expiredDate: string;
    histories: Array<PasswordRecordHistory> = [];
    id: string;
    links: Array<PasswordRecordLink> = []
    template: PasswordRecordCategories;
    username: string;
    ssid: string;
    key: string;
    url: string;
    code: string;
    ipAdres: string;
    port: string;
    https: boolean = false;
    ssh: boolean = false;
    telnet: boolean = false;
    note: string;
    description: string;
    password: string;
    selected: boolean = false;
    constructor(data) {
        this.companyId = data.companyId;
        this.companyName = data.companyName;
        this.expiredDate = data.expiredDate;
        this.histories = data.histories;
        this.id = data.id;
        this.links = data.links;
        this.template = new PasswordRecordCategories(data.template);
        this.username = data.username;
        this.description = data.description;

        this.ssid = data.ssid;
        this.key = data.key;
        this.url = data.url;
        this.code = data.code;
        this.ipAdres = data.ipAdres;
        this.port = data.port;
        this.https = data.https;
        this.ssh = data.ssh;
        this.telnet = data.telnet;
        this.note = data.note;
    }
    public isDefaultType() {
        return this.template.default;
    }
    public setPassword(data) {
        this.password = data;
    }
    public setCompanyId(data) {
        this.companyId = data;
    }
    public setExpiryDate(data) {
        this.expiredDate = data;
    }
    public setType(data) {
        this.template = data;
    }
    public getExpiryDateByTime() {
        return new Date(this.expiredDate).getTime();
    }
    public getDataForEdit(selectedUserAndDevices: Array<PasswordDeviceUser>) {
        let data: any = {
            id: this.id,
            companyId: this.companyId,
            description: this.description,
            expiredDate: this.expiredDate,
            links: selectedUserAndDevices.map(item => {
                if (item.type === "DEVICE") return { deviceId: item.id }
                if (item.type === "USER") return { userId: item.id }
                if (item.type === "GADGET") return { gadgetId: item.id }
            }),

            password: (this.password && this.password.length > 0) ? this.password : undefined,
            template: this.template
        };
        if (this.template.name === "OFFICE_365_ACCOUNT") {
            data.key = this.key;
            data.url = this.url;
            data.ssid = this.ssid;
            data.username = this.username;
            data.note = this.note;
        }
        if (this.template.name === "MICROSOFT_ACCOUNT") {
            data.url = this.url;
            data.username = this.username;
            data.note = this.note;
        }
        if (this.template.name === "EMAIL_ACCOUNT") {
            data.username = this.username;
            data.note = this.note;
        }
        if (this.template.name === "HOSTING") {
            data.url = this.url;
            data.username = this.username;
            data.note = this.note;
        }
        if (this.template.name === "DEVICE") {
            data.ip = (this.ipAdres) ? this.ipAdres : null;
            data.username = this.username;
            data.https = this.https;
            data.ssh = this.ssh;
            data.telnet = this.telnet;
            data.port = this.port;
            data.note = this.note;
        }
        if (this.template.name === "GENERIC") {
            data.username = this.username;
            data.code = this.code;
            data.note = this.note;
        }
        if (this.template.name === "AGENT") {
            data.username = this.username;
        }
        if (this.template.name === "WIFI_NETWORK") {
            data.ssid = this.ssid;
            data.note = this.note;
        }
        if (this.template.name === "LOCAL_USER_ACCOUNT") {
            data.username = this.username;
            data.note = this.note;
        }
        return data;
    }
}