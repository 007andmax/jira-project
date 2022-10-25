import { FilterListTop } from "src/class/list/filter-list-top";

export class TechUsersFilter {
    filterTop: Array<FilterListTop> = [new FilterListTop('name', 'ASC')];
    constructor() { }
    public onFilter(field, reqUsers) {

        let index = this.filterTop.findIndex(item => item.field === field);
        if (index > -1) {
            let sort = this.filterTop[index].filter;
            if (field === 'name') {
                this.clearFilter();
                if (sort === '' || sort === 'DESC') {
                    this.filterTop[index].filter = 'ASC';
                    this.onFilterName(reqUsers);
                } else {
                    this.filterTop[index].filter = 'DESC';
                    reqUsers.reverse();
                }

            }

        }
    }
    public clearFilter() {
        this.filterTop.forEach(item => item.filter = '');
    }
    private onFilterName(reqUsers) {
        reqUsers.sort((a, b) => ((a.firstName + a.lastName).toLowerCase() > (b.firstName + b.lastName).toLowerCase()) ?
            1 : (((b.firstName + b.lastName).toLowerCase() > (a.firstName + a.lastName).toLowerCase()) ? -1 : 0));
    }
}