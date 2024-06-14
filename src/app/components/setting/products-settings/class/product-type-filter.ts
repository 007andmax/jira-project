import { ProductsCategoryFilter } from "./products-category-filter";

export class ProductTypeFilter extends ProductsCategoryFilter {

    public onFilterName(list) {
        list.sort((a, b) => (a.title.toLowerCase() > b.title.toLowerCase()) ?
            1 : ((b.title.toLowerCase() > a.title.toLowerCase()) ? -1 : 0));
    }
}