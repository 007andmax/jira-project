import { ProductsCategoryFilter } from "../../products-settings/class/products-category-filter";

export class ManageTagsFilter extends ProductsCategoryFilter {

    public onFilterName(list) {
        list.sort((a, b) => (a.word.toLowerCase() > b.word.toLowerCase()) ?
            1 : ((b.word.toLowerCase() > a.word.toLowerCase()) ? -1 : 0));
    }
    onFilterCount(list) {
        list.sort((a, b) => (a.usageCounter > b.usageCounter) ?
            1 : ((b.usageCounter > a.usageCounter) ? -1 : 0));
    }
}