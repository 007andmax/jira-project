import { FilterListTop } from 'src/ng2/class/list/filter-list-top';
import { User } from './user';
import { Company } from 'src/ng2/app/interfaces/company/company';

export class UserFilter {
    filterTop: Array<FilterListTop> = [new FilterListTop('name', 'ASC'),
    new FilterListTop('company', ''),
    new FilterListTop('contact', ''),
    new FilterListTop('tickets', '')];
    clientType: string;
    tehUser: string;
    clientIndustry: string;
    title:string;
    constructor() { }

    public setLeftFilters(clientType,tehUser,clientIndustry,title) {
        this.clientType = clientType;
        this.tehUser= tehUser;
        this.clientIndustry = clientIndustry;
        this.title = title;
    }
    public setTitle(data) {
        this.title = data;
    }
    public setClientType(data) {
        this.clientType = data;
    }
    public getClientType() {
        return this.clientType;
    }
    public getFilterList(reqCompaniesList: Array<User>,companies:Array<Company>) {
        let list = reqCompaniesList.filter(item => {
            let indexCompny = companies.findIndex( company => company.id === item.company.id && company.clientType === this.clientType);
            let clientType = null;
            if (indexCompny > -1) clientType =  companies[indexCompny].clientType;
            if (this.clientType && clientType || this.title &&  item.designation === this.title) {
                return true;
            } else if (this.clientType && !clientType || this.title &&  item.designation !== this.title) {
                return false;
            }
            return true;
        })
        return list;

    }
    public setTehUser(data) {
        this.tehUser = data;
    }
    public setClientIndustry(data) {
        this.clientIndustry = data;
    }


    public clearFilter() {
        this.filterTop.forEach(item => item.filter = '');
    }

    public onFilter(field, reqUsers,companies) {
       
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
                    this.onFilterCompany(reqUsers,companies);

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
        let index = companies.findIndex(item => item.id === user.company.id);
        return (index > -1) ? companies[index].name : '';
    }
    private onFilterContact (reqUsers) {
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

    private onFilterTickets (reqUsers) {
        reqUsers.sort((a, b) => ((a.userStatistic.ticketsSubmitted || 0) > (b.userStatistic.ticketsSubmitted || 0)) ?
        1 : (((b.userStatistic.ticketsSubmitted || 0) > (a.userStatistic.ticketsSubmitted || 0)) ? -1 : 0));
    }

    private onFilterName(reqUsers) {
        reqUsers.sort((a, b) => ((a.firstName + a.lastName).toLowerCase() > (b.firstName + b.lastName).toLowerCase()) ?
            1 : (((b.firstName + b.lastName).toLowerCase() > (a.firstName + a.lastName).toLowerCase()) ? -1 : 0));
    }
}