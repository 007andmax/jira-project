import { ProductsCategoryFilter } from "../../products-settings/class/products-category-filter";

export class ManageTagsCompaniesFilter extends ProductsCategoryFilter {

    public onFilterName(list) {
        list.sort((a, b) => (a.word.toLowerCase() > b.word.toLowerCase()) ?
            1 : ((b.word.toLowerCase() > a.word.toLowerCase()) ? -1 : 0));
    }
    onFilterCount(list) {
        list.sort((a, b) => (a.usedCounter > b.usedCounter) ?
            1 : ((b.usedCounter > a.usedCounter) ? -1 : 0));
    }
}