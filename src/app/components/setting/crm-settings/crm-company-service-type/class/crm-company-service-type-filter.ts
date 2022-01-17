import { ProductsCategoryFilter } from "../../../products-settings/class/products-category-filter";

export class CrmCompanyServiceTypeFilter extends ProductsCategoryFilter {

    onFilterCount(list) {
        list.sort((a, b) => (a.usageCounter > b.usageCounter) ?
            1 : ((b.usageCounter > a.usageCounter) ? -1 : 0));
    }
}