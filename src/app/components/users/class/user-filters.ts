import { FilterListTop } from "src/class/list/filter-list-top";
import { UserDefaultSubscription } from "./user-default-subscription";

export class UserFilters {
    filterTop: Array<FilterListTop> = [new FilterListTop('NAME', 'ASC'),
    new FilterListTop('INDUSTRY', ''),
    new FilterListTop('TICKET_NUMBER', ''),
    new FilterListTop('PORTAL_STATUS', '')];
    "jobTitles": Array<string> = [];
    "companies": Array<string> = [];
    "ticketSubscription": boolean;
    "ticketManagerSubscription": boolean;
    "invoiceSubscription": boolean;
    "tags": Array<string> = [];
    "customSubscriptions": Array<string> = [];
    "hasAccess": boolean = false;
    "sortBy": string = "NAME_ASC";
    "defaultSubscriptions": UserDefaultSubscription = new UserDefaultSubscription(null);
    clientType: string;
    username: string;
    size: number = 30;
    page: number = 0;
    isArchive: boolean = false;
    isDisbledCompany: boolean = false;
    constructor() {
        this.resetDefaultSubscriptions();
    }
    public setIsArchive(data) {
        this.isArchive = data;
    }
    public setHasAccess(data) {
        this.hasAccess = data;
    }
    public setSortBy(field) {
        let index = this.filterTop.findIndex(item => item.field === field);
        if (index > -1) {
            let sort = this.filterTop[index].filter;
            if (field === 'NAME') {
                this.clearFilter();
                if (sort === '' || sort === 'DESC') {
                    this.filterTop[index].filter = 'ASC';
                } else {
                    this.filterTop[index].filter = 'DESC';
                }
            }
            if (field === 'INDUSTRY') {
                this.clearFilter();
                if (sort === '' || sort === 'DESC') {
                    this.filterTop[index].filter = 'ASC';
                } else {
                    this.filterTop[index].filter = 'DESC';
                }
            }
            if (field === 'TICKET_NUMBER') {
                this.clearFilter();
                if (sort === '' || sort === 'DESC') {
                    this.filterTop[index].filter = 'ASC';
                } else {
                    this.filterTop[index].filter = 'DESC';
                }
            }
            if (field === 'PORTAL_STATUS') {
                this.clearFilter();
                if (sort === '' || sort === 'DESC') {
                    this.filterTop[index].filter = 'ASC';
                } else {
                    this.filterTop[index].filter = 'DESC';
                }
            }
            this.sortBy = `${field}_${this.filterTop[index].filter}`;
        }
    }
    /**
  * @description Clear fields 'filter' from object 'filterTop'
  */
    public clearFilter() {
        this.filterTop.forEach(item => item.filter = '');
    }
    public getClientType() {
        return this.clientType;
    }
    public setUserName(data) {
        this.username = data;
    }
    public getCustomSubscriptions() {
        return this.customSubscriptions;
    }
    public setData(data) {
        this.jobTitles = data.jobTitles;
        this.companies = data.companies;
        this.ticketSubscription = data.ticketSubscription;
        this.ticketManagerSubscription = data.ticketManagerSubscription;
        this.invoiceSubscription = data.invoiceSubscription;
        this.tags = data.tags;
        this.customSubscriptions = data.customSubscriptions;
        this.hasAccess = data.hasAccess;
        this.sortBy = data.sortBy;
        this.clientType = data.clientType;
        this.username = data.username;
        this.isArchive = data.isArchive;
        this.page = data.page;
    }
    public resetDefaultSubscriptions() {
        this.ticketSubscription = false;
        this.ticketManagerSubscription = false;
        this.invoiceSubscription = false;
        this.defaultSubscriptions.clearEnabledAll();
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
            this.tags.length > 0 ||
            this.customSubscriptions.length > 0 ||
            this.hasAccess
    }
    public getDataForRequest() {
        let data: any = {};
        if (this.jobTitles.length > 0) data.jobTitles = this.jobTitles;
        if (this.companies.length > 0) data.companies = this.companies;
        if (this.ticketSubscription) data.ticketSubscription = this.ticketSubscription;
        if (this.ticketManagerSubscription) data.ticketManagerSubscription = this.ticketManagerSubscription;
        if (this.invoiceSubscription) data.invoiceSubscription = this.invoiceSubscription;
        if (this.tags.length > 0) data.tags = this.tags;
        if (this.customSubscriptions.length > 0) data.customSubscriptions = this.customSubscriptions;
        if (this.hasAccess) data.hasAccess = this.hasAccess;
        if (this.sortBy) data.sortBy = this.sortBy;
        if (this.clientType) data.clientType = this.clientType;
        if (this.username) data.username = this.username;
        return data
    }
}