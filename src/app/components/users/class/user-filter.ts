import { FilterListTop } from 'src/class/list/filter-list-top';
import { User } from './user';
import { Company } from 'src/app/interfaces/company/company';
import { CrmCompanyJobTitle } from '../../setting/crm-settings/crm-company-job-title/class/crm-company-job-title';
import { UserDefaultSubscription } from './user-default-subscription';
import { UserCustomSubscription } from './user-custom-subscription';
import { CrmCompanyIndustry } from '../../setting/crm-settings/crm-company-industry/class/crm-company-industry';
import { CompanyTag } from '../../companies/company-tags/class/company-tag';

export class UserFilter {
    filterTop: Array<FilterListTop> = [new FilterListTop('name', 'ASC'),
    new FilterListTop('company', ''),
    new FilterListTop('industry', ''),
    new FilterListTop('portalAccessStatus', ''),
    new FilterListTop('primaryEmail', ''),
    new FilterListTop('contact', ''),
    new FilterListTop('tickets', '')];
    tags: Array<CompanyTag> = []
    clientType: string;
    company: string;
    clientIndustry: CrmCompanyIndustry;
    title: CrmCompanyJobTitle;
    defaultSubscriptions: UserDefaultSubscription;
    customSubscriptions: Array<UserCustomSubscription> = [];
    constructor() {

    }
    /**
* @description Set new value Default Subscriptions
* @param {UserDefaultSubscription} data - Object Default Subscription
*/
    public setDefaultSubscriptions(data) {
        this.defaultSubscriptions = data;
    }
    /**
* @description Set list Custom Subscriptions
* @param {Array<UserCustomSubscription>} data - Array Objects Custom Subscriptions
*/
    public setCustomSubscriptions(data) {
        this.customSubscriptions = data;
    }
    /**
* @description Set list Tags
* @param {Array<CompanyTag>} data - Array Objects Tags
*/
    public setTags(data) {
        this.tags = data;
    }
    /**
* @description Set new values for fields:
* - clientType
* - company
* - clientIndustry
* - title
* - defaultSubscriptions
* - customSubscriptions
* - tags
* @param {string} clientType - Value Client Type
* @param {string} company - Value Company
* @param {CrmCompanyIndustry} clientIndustry - Object Client Industry
* @param {string} title - Value Title
* @param {UserDefaultSubscription} defaultSubscriptions - Object Default Subscriptions
* @param {Array<UserCustomSubscription>} customSubscriptions - Array Objects Custom Subscriptions
* @param {Array<CompanyTag>} tags - Array Objects Tags
*/
    public setLeftFilters(clientType, company, clientIndustry, title, defaultSubscriptions, customSubscriptions, tags) {
        this.clientType = clientType;
        this.company = company;
        this.clientIndustry = clientIndustry;
        this.title = title;
        this.defaultSubscriptions = defaultSubscriptions;
        this.customSubscriptions = customSubscriptions;
        this.tags = tags;
    }
    /**
* @description Set new value Company
* @param  {string} data  - Object Company
*/
    public setCompany(data) {
        this.company = data;
    }
    /**
* @description Set new value Title
* @param  {string} data  - value Title 
*/
    public setTitle(data) {
        this.title = data;
    }
    /**
* @description Set new value Client Type
* @param  {string} clientType  - value Client Type 
*/
    public setClientType(data) {
        this.clientType = data;
    }
    /**
* @description Return value field 'clientType'
* @returns  {string} This is the result
*/
    public getClientType() {
        return this.clientType;
    }
    /**
* @description Return sort list Users by filters
* @param  {Array<User>} reqUsersList  - Array Objects of User
* @param  {Array<Company>} companies  - Array Objects of Company
* @returns  {Array<User>} This is the result
*/
    public getFilterList(reqUsersList: Array<User>, companies: Array<Company>) {

        let list = reqUsersList.filter(item => {
            let indexCompany = companies.findIndex(company => item.customerCompaniesInfo.some(clientCompany => clientCompany.companyId === company.id));
            let clientType: boolean = false;
            let clientIndustry: boolean = false;

            if (indexCompany > -1 && this.clientType === companies[indexCompany].clientType) clientType = true;
            //if (this.clientIndustry === ((companies[indexCompany].clientIndustry) ? companies[indexCompany].clientIndustry.name : '')) clientIndustry = true;

            if (((this.clientType) ? clientType === true : true) && ((this.title) ? item.jobTitleId === this.title.id : true) && ((this.company) ? item.customerCompaniesInfo.find(clientCompany => clientCompany.companyId === this.company) : true) && ((this.clientIndustry) ? this.clientIndustry.id === item.userIndustryId : true) && this.isUserDefaultSubscription(item.defaultSubscriptions) && this.isUserCustomSubscription(item.customSubscriptions) && this.isUserTags(item.tags)) {
                return true;
            } else {
                return false;
            }

        })
        return list;

    }
    public isUserTags(list) {
        let isExist = true;

        this.tags.forEach(tag => {
            let find = list.find(tagUser => tagUser.id === tag.id);
            if (!find) isExist = false;
        })
        return isExist;
    }
    public isUserCustomSubscription(list) {
        let isExist = true;

        this.customSubscriptions.forEach(subscription => {
            let find = list.find(subscriptionUser => subscriptionUser.id === subscription.id);
            if (!find) isExist = false;
        })
        return isExist;
    }
    public isUserDefaultSubscription(item) {
        if (!this.defaultSubscriptions) return true;
        let isExist = true;
        if (this.defaultSubscriptions.invoiceSubscription.enabled && this.defaultSubscriptions.invoiceSubscription.enabled !== item.invoiceSubscription.enabled) isExist = false;
        if (this.defaultSubscriptions.ticketManagerSubscription.enabled && this.defaultSubscriptions.ticketManagerSubscription.enabled !== item.ticketManagerSubscription.enabled) isExist = false;
        if (this.defaultSubscriptions.ticketSubscription.enabled && this.defaultSubscriptions.ticketSubscription.enabled !== item.ticketSubscription.enabled) isExist = false
        return isExist;
    }
    public setClientIndustry(data) {
        this.clientIndustry = data;
    }
    public getCustomSubscriptions() {
        return this.customSubscriptions;
    }

    public clearFilter() {
        this.filterTop.forEach(item => item.filter = '');
    }

    public onFilter(field, reqUsers, companies, industries) {

        let index = this.filterTop.findIndex(item => item.field === field);
        if (index > -1) {
            let sort = this.filterTop[index].filter;
            if (field === 'name') {
                this.clearFilter();
                if (sort === '' || sort === 'DESC') {
                    this.filterTop[index].filter = 'ASC';
                    this.onFilterName(reqUsers);
                } else {
                    this.filterTop[index].filter = 'DESC';
                    reqUsers.reverse();
                }

            }
            if (field === 'company') {
                this.clearFilter();
                if (sort === '' || sort === 'DESC') {
                    this.filterTop[index].filter = 'ASC';
                    this.onFilterCompany(reqUsers, companies);
                } else {
                    this.filterTop[index].filter = 'DESC';
                    reqUsers.reverse();
                }
            }
            if (field === 'portalAccessStatus') {
                this.clearFilter();
                if (sort === '' || sort === 'DESC') {
                    this.filterTop[index].filter = 'ASC';
                    this.onFilterPortalAccessStatus(reqUsers);
                } else {
                    this.filterTop[index].filter = 'DESC';
                    reqUsers.reverse();
                }
            }
            if (field === 'industry') {
                this.clearFilter();
                if (sort === '' || sort === 'DESC') {

                    this.filterTop[index].filter = 'ASC';
                    this.onFilterIndustry(reqUsers, industries);

                } else {

                    this.filterTop[index].filter = 'DESC';
                    reqUsers.reverse();
                }


            }
            if (field === 'contact') {
                this.clearFilter();
                if (sort === '' || sort === 'DESC') {
                    this.filterTop[index].filter = 'ASC';
                    this.onFilterContact(reqUsers);
                } else {
                    this.filterTop[index].filter = 'DESC';
                    reqUsers.reverse();
                }


            }


            if (field === 'tickets') {
                this.clearFilter();
                if (sort === '' || sort === 'DESC') {
                    this.filterTop[index].filter = 'ASC';
                    this.onFilterTickets(reqUsers);
                } else {
                    this.filterTop[index].filter = 'DESC';
                    reqUsers.reverse();
                }


            }
            if (field === 'primaryEmail') {
                this.clearFilter();
                if (sort === '' || sort === 'DESC') {
                    this.filterTop[index].filter = 'ASC';
                    this.onFilterPrimaryEmail(reqUsers);
                } else {
                    this.filterTop[index].filter = 'DESC';
                    reqUsers.reverse();
                }


            }

        }
    }
    private getContact(user) {
        let str = '';
        if (user.phoneNumbers && user.phoneNumbers.length && user.phoneNumbers[0] && user.phoneNumbers[0].number) str += user.phoneNumbers[0].number;
        if (user.phoneNumbers && user.phoneNumbers.length && user.phoneNumbers[1] && user.phoneNumbers[1].number) str += user.phoneNumbers[1].number;
        return str;
    }
    private getCompanyName(user, companies) {
        if (user.company.isDefault) return '';
        let index = companies.findIndex(item => user.customerCompaniesInfo.find(clientCompany => clientCompany.companyId === item.id));
        return (index > -1) ? companies[index].name : '';
    }
    private getIndustryName(user, industries) {
        let index = industries.findIndex(item => item.id == user.userIndustryId);
        return (index > -1) ? industries[index].name : '';
    }
    private onFilterContact(reqUsers) {
        reqUsers.sort((a, b) => {
            let first = this.getContact(a);
            let next = this.getContact(b);
            return (first.toLowerCase() > next.toLowerCase()) ?
                1 : ((next.toLowerCase() > first.toLowerCase()) ? -1 : 0)
        });
    }
    private onFilterCompany(reqUsers, companies) {
        reqUsers.sort((a, b) => {
            let first = this.getCompanyName(a, companies);
            let next = this.getCompanyName(b, companies);
            return (first.toLowerCase() > next.toLowerCase()) ?
                1 : ((next.toLowerCase() > first.toLowerCase()) ? -1 : 0)
        });


    }
    private onFilterIndustry(reqUsers, industries) {
        reqUsers.sort((a, b) => {
            let first = this.getIndustryName(a, industries);
            let next = this.getIndustryName(b, industries);
            return (first.toLowerCase() > next.toLowerCase()) ?
                1 : ((next.toLowerCase() > first.toLowerCase()) ? -1 : 0)
        });
    }
    private onFilterPortalAccessStatus(reqUsers) {
        reqUsers.sort((a, b) => (a.portalAccessStatus.toLowerCase() > b.portalAccessStatus.toLowerCase()) ?
            1 : (b.portalAccessStatus.toLowerCase() > a.portalAccessStatus.toLowerCase() ? -1 : 0));
    }
    private onFilterPrimaryEmail(reqUsers) {
        reqUsers.sort((a, b) => (a.primaryEmail.toLowerCase() > b.primaryEmail.toLowerCase()) ?
            1 : (b.primaryEmail.toLowerCase() > a.primaryEmail.toLowerCase() ? -1 : 0));
    }
    private onFilterTickets(reqUsers) {
        reqUsers.sort((a, b) => ((a.userStatistic.ticketsSubmitted || 0) > (b.userStatistic.ticketsSubmitted || 0)) ?
            1 : (((b.userStatistic.ticketsSubmitted || 0) > (a.userStatistic.ticketsSubmitted || 0)) ? -1 : 0));
    }
    private onFilterName(reqUsers) {
        reqUsers.sort((a, b) => ((a.firstName + a.lastName).toLowerCase() > (b.firstName + b.lastName).toLowerCase()) ?
            1 : (((b.firstName + b.lastName).toLowerCase() > (a.firstName + a.lastName).toLowerCase()) ? -1 : 0));
    }
}