import { PasswordRecordHistory } from "./password-record-history";
import { PasswordRecordLink } from "./password-record-link";

export class PasswordRecord {
    companyId: string;
    companyName: string;
    expiredDate: string;
    histories: Array<PasswordRecordHistory> = [];
    id: string;
    links: Array<PasswordRecordLink> = []
    template: string;
    username: string;
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
        this.template = data.template;
        this.username = data.username;
        this.description = data.description;
    }
    public setPassword(data) {
        this.password = data;
    }
}