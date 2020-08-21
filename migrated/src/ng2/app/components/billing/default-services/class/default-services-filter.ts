import { FilterListTop } from 'src/ng2/class/list/filter-list-top';

export class DefaultServicesFilter {
    filterTop: Array<FilterListTop> = [new FilterListTop('name', ''),
    new FilterListTop('rate', ''),
    new FilterListTop('taxes', '')];
    constructor() {}

    public onFilter(field, servicesList) {
       
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
                    this.onFilterTaxes(servicesList);
                } else {
                    this.filterTop[index].filter = 'DESC';
                     servicesList.reverse();
                }
            }
        }
    }
    getSelectedTaxNames(taxes) {
        return taxes && taxes.map((tax) => {
          return tax.name + ' ' + tax.rate + '%';
        }).join(', ') || '';
      };
    private onFilterRate(servicesList) {
        servicesList.sort((a, b) => (a.rate > b.rate) ?
            1 : ((b.rate > a.rate) ? -1 : 0));
    }
    private onFilterTaxes(servicesList) {
        servicesList.sort((a, b) => ((this.getSelectedTaxNames(a.taxes)).toLowerCase() > (this.getSelectedTaxNames(b.taxes)).toLowerCase()) ?
            1 : (((this.getSelectedTaxNames(b.taxes)).toLowerCase() > (this.getSelectedTaxNames(a.taxes)).toLowerCase()) ? -1 : 0));
    }
    private onFilterName(servicesList) {
        servicesList.sort((a, b) => ((a.name).toLowerCase() > (b.name).toLowerCase()) ?
            1 : (((b.name).toLowerCase() > (a.name).toLowerCase()) ? -1 : 0));
    }
    public clearFilter() {
        this.filterTop.forEach(item => item.filter = '');
    }
}