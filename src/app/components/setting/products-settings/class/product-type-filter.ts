import { ProductsCategoryFilter } from "./products-category-filter";

export class ProductTypeFilter extends ProductsCategoryFilter {

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
            this.direction = this.filter[index].filter;
        }
    }
    public onFilterName(list) {
        list.sort((a, b) => (a.title.toLowerCase() > b.title.toLowerCase()) ?
            1 : ((b.title.toLowerCase() > a.title.toLowerCase()) ? -1 : 0));
    }
}