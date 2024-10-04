import { Tag } from "src/app/interfaces/tag/tag";

export class UserGlobalFilter {
    "id": string;
    "name": string = "";
    "global": boolean = false;
    "forMarketing": boolean = false;
    "jobTitles": Array<string> = [];
    "companies": Array<string> = [];
    "tags": Array<string> = [];
    tagDtos: Array<Tag> = [];
    "customSubscriptions": Array<string> = [];
    "ticketSubscription": boolean;
    "ticketManagerSubscription": boolean;
    "invoiceSubscription": boolean;
    "hasAccess": boolean = false;
    "modified": boolean;
    constructor(data = null) {
        if (data) {
            for (const key in data) {
                this[key] = data[key];
            }
        }
    }
    public setCustomSubscriptions(data) {
        this.customSubscriptions = data;
    }
    public setCompanies(data) {
        this.companies = data;
    }
    public setJobTitles(data) {
        this.jobTitles = data;
    }
    public setTags(data) {
        this.tags = data;
    }
    public changeDefaultSubscriptions(data) {
        this.invoiceSubscription = data.invoiceSubscription.enabled;
        this.ticketSubscription = data.ticketSubscription.enabled;
        this.ticketManagerSubscription = data.ticketManagerSubscription.enabled;
    }
    public setForMarketing(data) {
        this.forMarketing = data;
    }
    public getDataForRequest() {
        let data: any = {
            "name": this.name,
            "global": this.global,
            "jobTitles": this.jobTitles,
            "companies": this.companies,
            "ticketSubscription": this.ticketSubscription,
            "ticketManagerSubscription": this.ticketManagerSubscription,
            "invoiceSubscription": this.invoiceSubscription,
            "tags": this.tags,
            "customSubscriptions": this.customSubscriptions,
            "hasAccess": this.hasAccess,
            forMarketing: this.forMarketing
        };
        return data;
    }
}