import { CompanyIndustry } from "src/app/interfaces/company/company-industry";
import { Tag } from "src/app/interfaces/tag/tag";
import { CompanyFilterTop } from "./company-filter-top";
import { CompanyDeviceCount } from "./company-device-count";
import { CompanyItem } from "./company-item";
import { TicketSortBy } from "../../tickets/tickets/class/ticket-sort-by";

export class CompanyFilter {
    clientType: string;
    clientIndustry: CompanyIndustry;
    tags: Array<Tag> = [];
    techUser: string;
    isArchived: boolean;
    devices: Array<CompanyDeviceCount> = [];
    users = [];
    showArchivedCompanies: boolean = false;
    filter: Array<CompanyFilterTop> = [
        new CompanyFilterTop('name', 'ASC'),
        new CompanyFilterTop('type', ''),
        new CompanyFilterTop('address', ''),
        new CompanyFilterTop('primary_contact', ''),
        new CompanyFilterTop('email', ''),
        new CompanyFilterTop('tickets', ''),
        new CompanyFilterTop('devices', ''),
        new CompanyFilterTop('users', '')];
    search: string;
    sortBy: TicketSortBy = new TicketSortBy('name', 'ASC');
    constructor() {

    }
    public setSearch(data) {
        this.search = data;
    }
    public setDevices(data) {
        this.devices = data;
    }
    public setUsers(data) {
        this.users = data;
    }
    public setShowArchivedCompanies(data) {
        this.showArchivedCompanies = data;
    }
    getDataForFilter() {
        return {
            tagIds: (this.tags.length > 0) ? this.tags.map(item => item.id) : undefined,
            clientType: (this.clientType) ? this.clientType : undefined,
            techLeadId: (this.techUser) ? this.techUser : undefined,
            clientIndustryId: (this.clientIndustry) ? this.clientIndustry.id : undefined,
            isArchived: this.isArchived,
            needCompanyInfo: true,
        }
    }
    public setArchived(data) {
        this.isArchived = data;
    }
    public setTechUser(data) {
        this.techUser = data;
    }
    public setFilters(data) {
        if (data.clientType !== "ARCHIVE") this.clientType = data.clientType;
        if (data.clientType === "ARCHIVE") this.clientType = null;
        this.clientIndustry = data.clientIndustry;
        this.techUser = data.techUser;
        this.tags = data.tags;
    }
    public getFilterList(reqList: Array<CompanyItem>) {
        return reqList.filter(item => {
            if ((this.search ? item.name.toLocaleLowerCase().includes(this.search.toLocaleLowerCase()) : true)) {
                return true;
            } else {
                return false;
            }
        })
    }
    public isExistFilters() {
        return this.clientType || this.clientIndustry || this.techUser || this.tags.length > 0;
    }
    public setClientIndustry(data) {
        this.clientIndustry = data;
    }
    public setTags(data) {
        this.tags = data;
    }
    public setClientType(data) {
        this.clientType = data;
    }
    onFilter(field, list) {
        let index = this.filter.findIndex(item => item.field === field);
        if (index > -1) {
            let sort = this.filter[index].filter;
            if (field === 'name') {
                this.clearFilter();
                if (sort === '' || sort === 'DESC') {
                    this.filter[index].filter = 'ASC';
                    this.onFilterName(list);
                } else {
                    this.filter[index].filter = 'DESC';
                    list.reverse();
                }
            }
            if (field === 'type') {
                this.clearFilter();
                if (sort === '' || sort === 'DESC') {
                    this.filter[index].filter = 'ASC';
                    this.onFilterClientType(list);
                } else {
                    this.filter[index].filter = 'DESC';
                    list.reverse();
                }
            }
            if (field === 'address') {
                this.clearFilter();
                if (sort === '' || sort === 'DESC') {
                    this.filter[index].filter = 'ASC';
                    this.onFilterAdress(list);
                } else {
                    this.filter[index].filter = 'DESC';
                    list.reverse();
                }
            }
            if (field === 'primary_contact') {
                this.clearFilter();
                if (sort === '' || sort === 'DESC') {
                    this.filter[index].filter = 'ASC';
                    this.onFilterPrimaryContact(list);
                } else {
                    this.filter[index].filter = 'DESC';
                    list.reverse();
                }
            }
            if (field === 'email') {
                this.clearFilter();
                if (sort === '' || sort === 'DESC') {
                    this.filter[index].filter = 'ASC';
                    this.onFilterPrimaryEmail(list);
                } else {
                    this.filter[index].filter = 'DESC';
                    list.reverse();
                }
            }
            if (field === 'tickets') {
                this.clearFilter();
                if (sort === '' || sort === 'DESC') {
                    this.filter[index].filter = 'ASC';
                    this.onFilterTickets(list);
                } else {
                    this.filter[index].filter = 'DESC';
                    list.reverse();
                }
            }
            if (field === 'devices') {
                this.clearFilter();
                if (sort === '' || sort === 'DESC') {
                    this.filter[index].filter = 'ASC';
                    this.onFilterDevices(list);
                } else {
                    this.filter[index].filter = 'DESC';
                    list.reverse();
                }
            }
            if (field === 'users') {
                this.clearFilter();
                if (sort === '' || sort === 'DESC') {
                    this.filter[index].filter = 'ASC';
                    this.onFilterUsers(list);
                } else {
                    this.filter[index].filter = 'DESC';
                    list.reverse();
                }
            }
            this.sortBy.sortDirection = this.filter[index].filter;
        }
    }
    private clearFilter() {
        this.filter.forEach(item => item.filter = '');
    }
    private onFilterUsers(list) {
        list.sort((a, b) => (this.getCountusers(a) > this.getCountusers(b)) ?
            1 : ((this.getCountusers(b) > this.getCountusers(a)) ? -1 : 0));
    }
    private onFilterDevices(list) {
        list.sort((a, b) => (((this.devices.find(item => item.companyId == a.id)) ? this.devices.find(item => item.companyId == a.id).count : 0) > ((this.devices.find(item => item.companyId == b.id)) ? this.devices.find(item => item.companyId == b.id).count : 0) ?
            1 : ((this.devices.find(item => item.companyId == b.id)) ? this.devices.find(item => item.companyId == b.id).count : 0) > ((this.devices.find(item => item.companyId == a.id)) ? this.devices.find(item => item.companyId == a.id).count : 0) ? -1 : 0));
    }
    private onFilterName(list) {
        list.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
            1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));
    }
    private onFilterClientType(list) {
        list.sort((a, b) => (a.clientType.toLowerCase() > b.clientType.toLowerCase()) ?
            1 : ((b.clientType.toLowerCase() > a.clientType.toLowerCase()) ? -1 : 0));
    }
    private onFilterAdress(list) {
        list.sort((a, b) => (this.getPrimaryAddress(a) > this.getPrimaryAddress(b)) ?
            1 : ((this.getPrimaryAddress(b) > this.getPrimaryAddress(a)) ? -1 : 0));
    }
    private onFilterPrimaryContact(list) {
        list.sort((a, b) => (this.getPrimaryPhone(a).toLowerCase() > this.getPrimaryPhone(b).toLowerCase()) ?
            1 : ((this.getPrimaryPhone(b).toLowerCase() > this.getPrimaryPhone(a).toLowerCase()) ? -1 : 0));
    }
    private onFilterPrimaryEmail(list) {
        list.sort((a, b) => (this.getEmail(a).toLowerCase() > this.getEmail(b).toLowerCase()) ?
            1 : ((this.getEmail(b).toLowerCase() > this.getEmail(a).toLowerCase()) ? -1 : 0));
    }
    private onFilterTickets(list) {
        list.sort((a, b) => ((a.companyStatistic.ticketsSubmitted || 0) > (b.companyStatistic.ticketsSubmitted || 0)) ?
            1 : (((b.companyStatistic.ticketsSubmitted || 0) > (a.companyStatistic.ticketsSubmitted || 0)) ? -1 : 0));
    }
    private getCountusers(company) {
        return this.users.filter((user) => {
            var isArchived = user.deletedAt || company.deletedAt;
            return !isArchived && !this.showArchivedCompanies && user.customerCompaniesInfo.find(clientCompany => clientCompany.companyId === company.id) || this.showArchivedCompanies && isArchived && user.customerCompaniesInfo.find(clientCompany => clientCompany.companyId === company.id);
        }).length;
    }
    private getPrimaryAddress(company) {
        let primaryAddress;
        if (company.companyInfo) {
            if (company.companyInfo.addresses) {
                for (let address of company.companyInfo.addresses) {
                    if (address.isPrimary) primaryAddress = address;
                }
            }
        }
        if (primaryAddress) {
            return primaryAddress.addressWithSuitNumberAndPostalCode.toLowerCase();
        } else {
            return '';
        }
    }
    private getPrimaryPhone(company) {
        let primaryContact;
        if (company.companyInfo) {
            if (company.companyInfo.contacts) {
                for (let contact of company.companyInfo.contacts) {
                    if (!primaryContact || contact.priority > primaryContact.priority) primaryContact = contact;
                }
            }
        }
        return primaryContact ? `${primaryContact.firstName} ${primaryContact.lastName}` : '';
    }
    private getEmail(company) {
        let primaryContact;
        if (company.companyInfo) {
            if (company.companyInfo.contacts) {
                for (let contact of company.companyInfo.contacts) {
                    if (!primaryContact || contact.priority > primaryContact.priority) primaryContact = contact;
                }
            }
        }
        return primaryContact ? primaryContact.primaryEmail : '';
    }
}