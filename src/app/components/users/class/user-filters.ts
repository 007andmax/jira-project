import { UserDefaultSubscription } from "./user-default-subscription";

export class UserFilters {
    "jobTitles": Array<string> = [];
    "companies": Array<string> = [];
    "ticketSubscription": boolean;
    "ticketManagerSubscription": boolean;
    "invoiceSubscription": boolean;
    "industries": Array<string> = [];
    "tags": Array<string> = [];
    "customSubscriptions": Array<string> = [];
    "hasAccess": boolean;
    "sortBy": string;
    "defaultSubscriptions": UserDefaultSubscription = new UserDefaultSubscription(null);
    clientType: string;
    username: string;
    size: number = 30;
    page: number = 0;
    isArchive: boolean = false;
    constructor() {
        this.defaultSubscriptions.clearEnabledAll();
    }
    public setIsArchive(data) {
        this.isArchive = data;
    }
    public setSortBy(data) {
        this.sortBy = data;
    }
    public getClientType() {
        return this.clientType;
    }
    public setUserName(data) {
        this.username = data;
    }
    public setData(data) {
        this.jobTitles = data.jobTitles;
        this.companies = data.companies;
        this.ticketSubscription = data.ticketSubscription;
        this.ticketManagerSubscription = data.ticketManagerSubscription;
        this.invoiceSubscription = data.invoiceSubscription;
        this.industries = data.industries;
        this.tags = data.tags;
        this.customSubscriptions = data.customSubscriptions;
        this.hasAccess = data.hasAccess;
        this.sortBy = data.sortBy;
        this.clientType = data.clientType;
        this.username = data.username;
    }
    public setIndustries(data) {
        this.industries = data;
    }
    public setTags(data) {
        this.tags = data;
    }
    public setCustomSubscriptions(data) {
        this.customSubscriptions = data;
    }
    public setClientType(data) {
        this.clientType = data;
    }
    public setJobTitles(data) {
        this.jobTitles = data;
    }
    public setCompanies(data) {
        this.companies = data;
    }
    public changeDefaultSubscriptions(data) {
        this.defaultSubscriptions = new UserDefaultSubscription(data);
        this.invoiceSubscription = data.invoiceSubscription.enabled;
        this.ticketSubscription = data.ticketSubscription.enabled;
        this.ticketManagerSubscription = data.ticketManagerSubscription.enabled;
    }
    public isExistFilters() {
        return this.jobTitles.length > 0 ||
            this.companies.length > 0 ||
            this.ticketSubscription ||
            this.invoiceSubscription ||
            this.invoiceSubscription ||
            this.industries.length > 0 ||
            this.tags.length > 0 ||
            this.customSubscriptions.length > 0 ||
            this.hasAccess
    }
    public getDataForRequest() {
        return {
            "jobTitles": this.jobTitles,
            "companies": this.companies,
            "ticketSubscription": this.ticketSubscription,
            "ticketManagerSubscription": this.ticketManagerSubscription,
            "invoiceSubscription": this.invoiceSubscription,
            "industries": this.industries,
            "tags": this.tags,
            "customSubscriptions": this.customSubscriptions,
            "hasAccess": this.hasAccess,
            "sortBy": this.sortBy,
            "clientType": this.clientType,
            username: this.username
        }
    }
}