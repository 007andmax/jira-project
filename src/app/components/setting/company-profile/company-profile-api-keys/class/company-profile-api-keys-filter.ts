import { CompanyFilterTop } from "src/app/components/companies/class/company-filter-top";

export class CompanyProfileApiKeysFilter {
    filter: Array<CompanyFilterTop> = [
        new CompanyFilterTop('title', 'ASC')
    ];

    constructor() { }
    onFilter(field, list) {
        let index = this.filter.findIndex(item => item.field === field);
        if (index > -1) {
            let sort = this.filter[index].filter;
            if (field === 'title') {
                this.clearFilter();
                if (sort === '' || sort === 'DESC') {
                    this.filter[index].filter = 'ASC';
                    this.onFilterTitle(list);
                } else {
                    this.filter[index].filter = 'DESC';
                    list.reverse();
                }
            }
        }
    }
    onFilterByField(field, list) {
        let index = this.filter.findIndex(item => item.field === field);
        if (index > -1) {
            if (this.filter[index].filter == 'ASC') {
                this.onFilterTitle(list);
            } else {
                list.reverse();
            }
        }
    }

    public clearFilter() {
        this.filter.forEach(item => item.filter = '');
    }
    public onFilterTitle(list) {
        list.sort((a, b) => (a.title.toLowerCase() > b.title.toLowerCase()) ?
            1 : ((b.title.toLowerCase() > a.title.toLowerCase()) ? -1 : 0));
    }
}