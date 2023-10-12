import { CompanyFilterTop } from "src/app/components/companies/class/company-filter-top";

export class SuperAdminCompanyFilters {
    "offset": number = 0;
    "size": number = 30;
    "sortBy": string = "COMPANY_NAME_ASC"
    filter: Array<CompanyFilterTop> = [
        new CompanyFilterTop('CREATED_DATE', ''),
        new CompanyFilterTop('COMPANY_NAME', 'ASC'),
        new CompanyFilterTop('SUBDOMAIN', ''),
        new CompanyFilterTop('STATUS', '')];

    public setSortBy(field) {
        let index = this.filter.findIndex(item => item.field === field);
        if (index > -1) {
            let sort = this.filter[index].filter;
            if (field === 'CREATED_DATE') {
                this.clearFilter();
                if (sort === '' || sort === 'DESC') {
                    this.filter[index].filter = 'ASC';
                    this.sortBy = 'CREATED_DATE_ASC';
                } else {
                    this.filter[index].filter = 'DESC';
                    this.sortBy = 'CREATED_DATE_DESC';
                }
            }
            if (field === 'COMPANY_NAME') {
                this.clearFilter();
                if (sort === '' || sort === 'DESC') {
                    this.filter[index].filter = 'ASC';
                    this.sortBy = 'COMPANY_NAME_ASC';

                } else {
                    this.filter[index].filter = 'DESC';
                    this.sortBy = 'COMPANY_NAME_DESC';
                }
            }
            if (field === 'SUBDOMAIN') {
                this.clearFilter();
                if (sort === '' || sort === 'DESC') {
                    this.filter[index].filter = 'ASC';
                    this.sortBy = 'SUBDOMAIN_ASC';
                } else {
                    this.filter[index].filter = 'DESC';
                    this.sortBy = 'SUBDOMAIN_DESC';
                }
            }
            if (field === 'STATUS') {
                this.clearFilter();
                if (sort === '' || sort === 'DESC') {
                    this.filter[index].filter = 'ASC';
                    this.sortBy = 'STATUS_ASC';
                } else {
                    this.filter[index].filter = 'DESC';
                    this.sortBy = 'STATUS_DESC';

                }
            }
        }
    }
    private clearFilter() {
        this.filter.forEach(item => item.filter = '');
    }
    public setOffset(data) {
        this.offset = data;
    }
    public getDataForRequest() {
        return {
            offset: this.offset,
            size: this.size,
            sortBy: this.sortBy
        }
    }
}