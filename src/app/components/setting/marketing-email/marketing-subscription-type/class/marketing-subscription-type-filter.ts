import { ProductsCategoryFilter } from "../../../products-settings/class/products-category-filter";

export class MarketingSubscriptionTypeFilter extends ProductsCategoryFilter {

    onFilterCount(list) {
        list.sort((a, b) => (a.usersCount > b.usersCount) ?
            1 : ((b.usersCount > a.usersCount) ? -1 : 0));
    }
}