import { CompanyFilterTop } from "src/app/components/companies/class/company-filter-top";
import { ProductsCategoryFilter } from "../../../products-settings/class/products-category-filter";

export class MarketingSubscriptionTypeFilter extends ProductsCategoryFilter {
    filter: Array<CompanyFilterTop> = [
        new CompanyFilterTop('name', 'ASC'),
        new CompanyFilterTop('subscribedCount', ''),
        new CompanyFilterTop('unsubscribedCount', '')
    ];
    direction!: string;
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
            if (field === 'subscribedCount') {
                this.clearFilter();
                if (sort === '' || sort === 'DESC') {
                    this.filter[index].filter = 'ASC';
                    this.onFilterSubscribedCount(list);
                } else {
                    this.filter[index].filter = 'DESC';
                    list.reverse();
                }
            }
            if (field === 'unsubscribedCount') {
                this.clearFilter();
                if (sort === '' || sort === 'DESC') {
                    this.filter[index].filter = 'ASC';
                    this.onFilterUnSubscribedCount(list);
                } else {
                    this.filter[index].filter = 'DESC';
                    list.reverse();
                }
            }
            this.direction = this.filter[index].filter;
        }
    }
    public onFilterSubscribedCount(list) {
        list.sort((a, b) => (a.subscribedCount > b.subscribedCount) ?
            1 : ((b.subscribedCount > a.subscribedCount) ? -1 : 0));
    }
    public onFilterUnSubscribedCount(list) {
        list.sort((a, b) => (a.unsubscribedCount > b.unsubscribedCount) ?
            1 : ((b.unsubscribedCount > a.unsubscribedCount) ? -1 : 0));
    }
}