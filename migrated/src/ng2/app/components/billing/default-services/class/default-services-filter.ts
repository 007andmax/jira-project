import { FilterListTop } from 'src/ng2/class/list/filter-list-top';

export class DefaultServicesFilter {
    filterTop: Array<FilterListTop> = [new FilterListTop('name', ''),
    new FilterListTop('rate', ''),
    new FilterListTop('taxes', '')];
    constructor() {}

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
            if (field === 'rate') {
                this.clearFilter();
                if (sort === '' || sort === 'DESC') {
                    this.filterTop[index].filter = 'ASC';
                    this.onFilterRate(reqUsers);
                } else {
                    this.filterTop[index].filter = 'DESC';
                     reqUsers.reverse();
                }


            }
            if (field === 'taxes') {
                this.clearFilter();
                if (sort === '' || sort === 'DESC') {
                    this.filterTop[index].filter = 'ASC';
                 //   this.onFilterContact(reqUsers);
                } else {
                    this.filterTop[index].filter = 'DESC';
                     reqUsers.reverse();
                }
            }
        }
    }
    private onFilterRate(reqUsers) {
        reqUsers.sort((a, b) => (a.rate > b.rate) ?
            1 : ((b.rate > a.rate) ? -1 : 0));
    }
    private onFilterName(reqUsers) {
        reqUsers.sort((a, b) => ((a.name).toLowerCase() > (b.name).toLowerCase()) ?
            1 : (((b.name).toLowerCase() > (a.name).toLowerCase()) ? -1 : 0));
    }
    public clearFilter() {
        this.filterTop.forEach(item => item.filter = '');
    }
}