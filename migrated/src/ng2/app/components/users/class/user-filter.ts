import { FilterListTop } from 'src/ng2/class/list/filter-list-top';
import { User } from './user';
import { Company } from 'src/ng2/app/interfaces/company/company';

export class UserFilter {
    filterTop: Array<FilterListTop> = [new FilterListTop('name', 'ASC'),
    new FilterListTop('company', ''),
    new FilterListTop('contact', ''),
    new FilterListTop('tickets', '')];
    clientType: string;
    company: string;
    clientIndustry: string;
    title:string;
    constructor() { }

    public setLeftFilters(clientType,company,clientIndustry,title) {
        this.clientType = clientType;
        this.company= company;
        this.clientIndustry = clientIndustry;
        this.title = title;
    }
    public setCompany (data) {
        this.company= data;
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
        console.log('this.company',this.company);
        console.log('this.clientIndustry',this.clientIndustry);
      //  console.log('clientIndustry',clientIndustry);
        let list = reqCompaniesList.filter(item => {
            let indexCompany = companies.findIndex( company => company.id === item.company.id);
            let clientType:boolean = false;
            let clientIndustry:boolean = false;
            if (indexCompany > -1 && this.clientType === companies[indexCompany].clientType) clientType = true;
            if (indexCompany > -1 && this.clientIndustry === ((companies[indexCompany].clientIndustry) ? companies[indexCompany].clientIndustry.name : '')) clientIndustry = true;
         
            if (((this.clientType) ?  clientType === true : true) && ((this.title) ? item.designation === this.title : true) && ((this.company) ? this.company === item.company.id : true) && ((this.clientIndustry) ? clientIndustry === true : true)) {
                return true;
            } else  {
                return false;
            }
         
        })
        return list;

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