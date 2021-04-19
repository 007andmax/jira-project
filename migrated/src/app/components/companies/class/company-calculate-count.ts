import { Company } from 'src/app/interfaces/company/company';
import { LeftPanelCompaniesFilter } from '../../left-panel/left-panel-companies/class/left-panel-companies-filter';

export class CompanyCalculateCount {
    all: number = 0;
    current: number = 0;
    clients: number = 0;
    leads: number = 0;
    vendor: number = 0;
    constructor() { }

    public onCalculate(list: Array<Company>, filter: LeftPanelCompaniesFilter) {
        let filterList = filter.getFilterList(list);
        this.all = list.length;
        this.clients = list.filter(item => item.clientType === "CLIENT").length;
        this.leads = list.filter(item => item.clientType === "LEAD").length;
        this.vendor = list.filter(item => item.clientType === "VENDOR").length;
        this.current = JSON.parse(JSON.stringify(filterList.length));
    }

    public getCurrent() {
        return this.current;
    }
    public getAll() {
        return this.all;
    }

    public getClients() {
        return this.clients;
    }

    public getLeads() {
        return this.leads;
    }
    public getVndors() {
        return this.vendor;
    }
    public onCulculateCurrent(type) {
        if (type === "CLIENT") {
            this.current = JSON.parse(JSON.stringify(this.clients));
        }
        if (type === "LEAD") {
            this.current = JSON.parse(JSON.stringify(this.leads));
        }
        if (type === "VENDOR") {
            this.current = JSON.parse(JSON.stringify(this.vendor));
        }
    }
}