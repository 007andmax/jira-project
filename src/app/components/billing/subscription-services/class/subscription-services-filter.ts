import { FilterListTop } from "src/class/list/filter-list-top";

export class SubscriptionServicesFilter {
    filterTop: Array<FilterListTop> = [new FilterListTop('name', ''),
    new FilterListTop('rate', ''),
    new FilterListTop('taxes', '')];
    constructor() { }

    public onFilter(field, servicesList, taxes) {

        let index = this.filterTop.findIndex(item => item.field === field);
        if (index > -1) {
            let sort = this.filterTop[index].filter;
            if (field === 'name') {
                this.clearFilter();
                if (sort === '' || sort === 'DESC') {
                    this.filterTop[index].filter = 'ASC';
                    this.onFilterName(servicesList);
                } else {
                    this.filterTop[index].filter = 'DESC';
                    servicesList.reverse();
                }

            }
            if (field === 'rate') {
                this.clearFilter();
                if (sort === '' || sort === 'DESC') {
                    this.filterTop[index].filter = 'ASC';
                    this.onFilterRate(servicesList);
                } else {
                    this.filterTop[index].filter = 'DESC';
                    servicesList.reverse();
                }


            }
            if (field === 'taxes') {
                this.clearFilter();
                if (sort === '' || sort === 'DESC') {
                    this.filterTop[index].filter = 'ASC';
                    this.onFilterTaxes(servicesList, taxes);
                } else {
                    this.filterTop[index].filter = 'DESC';
                    servicesList.reverse();
                }
            }
        }
    }
    getSelectedTaxNames(taxes, listTaxes) {
        let list = listTaxes.filter(item => taxes.some(tax => tax == item.id))
        return list && list.map((tax) => {
            return tax.name + ' ' + tax.rate + '%';
        }).join(', ') || '';
    };
    private onFilterRate(servicesList) {
        servicesList.sort((a, b) => (a.rate > b.rate) ?
            1 : ((b.rate > a.rate) ? -1 : 0));
    }
    private onFilterTaxes(servicesList, taxes) {
        servicesList.sort((a, b) => ((this.getSelectedTaxNames(a.taxIds, taxes)).toLowerCase() > (this.getSelectedTaxNames(b.taxIds, taxes)).toLowerCase()) ?
            1 : (((this.getSelectedTaxNames(b.taxIds, taxes)).toLowerCase() > (this.getSelectedTaxNames(a.taxIds, taxes)).toLowerCase()) ? -1 : 0));
    }
    private onFilterName(servicesList) {
        servicesList.sort((a, b) => ((a.name).toLowerCase() > (b.name).toLowerCase()) ?
            1 : (((b.name).toLowerCase() > (a.name).toLowerCase()) ? -1 : 0));
    }
    public clearFilter() {
        this.filterTop.forEach(item => item.filter = '');
    }
}