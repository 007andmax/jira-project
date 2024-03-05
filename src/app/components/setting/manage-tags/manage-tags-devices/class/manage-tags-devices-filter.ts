import { CompanyFilterTop } from "src/app/components/companies/class/company-filter-top";

export class ManageTagsDevicesFilter {
    filter: Array<CompanyFilterTop> = [
        new CompanyFilterTop('name', 'ASC')
    ];
    constructor() { }
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
        }
    }
    public clearFilter() {
        this.filter.forEach(item => item.filter = '');
    }
    public onFilterName(list) {
        list.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
            1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));
    }
}