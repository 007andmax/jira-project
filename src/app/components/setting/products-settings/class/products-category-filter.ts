import { CompanyFilterTop } from "src/app/components/companies/class/company-filter-top";

export class ProductsCategoryFilter {

    filter: Array<CompanyFilterTop> = [
        new CompanyFilterTop('name', 'ASC'),
        new CompanyFilterTop('count', '')
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
                    console.log("list 1", list);
                } else {
                    this.filter[index].filter = 'DESC';
                    list.reverse();
                    console.log("list 2", list);
                }
            }
            if (field === 'count') {
                this.clearFilter();
                if (sort === '' || sort === 'DESC') {
                    this.filter[index].filter = 'ASC';
                    this.onFilterCount(list);
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
    public onFilterCount(list) {
        list.sort((a, b) => (a.productsAmount > b.productsAmount) ?
            1 : ((b.productsAmount > a.productsAmount) ? -1 : 0));
    }
}