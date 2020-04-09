import { FilterListTop } from 'src/ng2/class/list/filter-list-top';

export class CompanyproductsFilter {
    filterTop: Array<FilterListTop> = [new FilterListTop('date', 'ASC'),
    new FilterListTop('client', ''),
    new FilterListTop('mfg', ''),
    new FilterListTop('description', ''),
    new FilterListTop('ticketNumber', ''),
    new FilterListTop('invoiceNumber', ''),
    new FilterListTop('purchaseCost', ''),
    new FilterListTop('salePrice', '')];
  
    constructor() { }

    public clearFilter() {
        this.filterTop.forEach(item => item.filter = '');
    }
    public onFilterList(lines) {
        lines.sort((a, b) => (b.date.toLowerCase() > a.date.toLowerCase()) ?
        1 : ((a.date.toLowerCase() > b.date.toLowerCase()) ? -1 : 0));
    }
    public onFilter(field, lines) {
        let index = this.filterTop.findIndex(item => item.field === field);
        if (index > -1) {
            let sort = this.filterTop[index].filter;
            if (field === 'date') {
                this.clearFilter();
                if (sort === '' || sort === 'DESC') {
                    this.filterTop[index].filter = 'ASC';
                    this.onFilterDate(lines);
                } else {
                    this.filterTop[index].filter = 'DESC';
                    lines.reverse();
                }

            }
            if (field === 'client') {
                this.clearFilter();
                if (sort === '' || sort === 'DESC') {

                    this.filterTop[index].filter = 'ASC';
                    this.onFilterClients(lines);

                } else {

                    this.filterTop[index].filter = 'DESC';
                    lines.reverse();
                }


            }
            if (field === 'mfg') {
                this.clearFilter();
                if (sort === '' || sort === 'DESC') {
                    this.filterTop[index].filter = 'ASC';
                    this.onFilterMfg(lines);
                } else {
                    this.filterTop[index].filter = 'DESC';
                    lines.reverse();
                }


            }

           
            if (field === 'description') {
                this.clearFilter();
                if (sort === '' || sort === 'DESC') {
                    this.filterTop[index].filter = 'ASC';
                    this.onFilterDescription(lines);
                } else {
                    this.filterTop[index].filter = 'DESC';
                    lines.reverse();
                }
            }
            if (field === 'ticketNumber') {
                this.clearFilter();
                if (sort === '' || sort === 'DESC') {
                    this.filterTop[index].filter = 'ASC';
                    this.onFilterTicketNumber(lines);
                } else {
                    this.filterTop[index].filter = 'DESC';
                    lines.reverse();
                }
            }
            if (field === 'invoiceNumber') {
                this.clearFilter();
                if (sort === '' || sort === 'DESC') {
                    this.filterTop[index].filter = 'ASC';
                    this.onFilterInvoiceNumber(lines);
                } else {
                    this.filterTop[index].filter = 'DESC';
                    lines.reverse();
                }
            }
            if (field === 'purchaseCost') {
                this.clearFilter();
                if (sort === '' || sort === 'DESC') {
                    this.filterTop[index].filter = 'ASC';
                    this.onFilterPurchaseCost(lines);
                } else {
                    this.filterTop[index].filter = 'DESC';
                    lines.reverse();
                }
            }
            if (field === 'salePrice') {
                this.clearFilter();
                if (sort === '' || sort === 'DESC') {
                    this.filterTop[index].filter = 'ASC';
                    this.onFilterSalePrice(lines);
                } else {
                    this.filterTop[index].filter = 'DESC';
                    lines.reverse();
                }
            }
        }
    }
   
    private onFilterPurchaseCost (reqUsers) {
        reqUsers.sort((a, b) => ((a.purchaseCost || 0) > (b.purchaseCost || 0)) ?
        1 : (((b.purchaseCost || 0) > (a.purchaseCost || 0)) ? -1 : 0));
    }
    private onFilterSalePrice (reqUsers) {
        reqUsers.sort((a, b) => ((a.salePrice || 0) > (b.salePrice || 0)) ?
        1 : (((b.salePrice || 0) > (a.salePrice || 0)) ? -1 : 0));
    }

    private onFilterInvoiceNumber(lines) {
        lines.sort((a, b) => ((a.invoiceNumber || "").toLowerCase() > (b.invoiceNumber || "").toLowerCase()) ?
            1 : (((b.invoiceNumber || "").toLowerCase() > (a.invoiceNumber || "").toLowerCase()) ? -1 : 0));
    }
    private onFilterTicketNumber(lines) {
        lines.sort((a, b) => (a.ticketNumber.toLowerCase() > b.ticketNumber.toLowerCase()) ?
            1 : ((b.ticketNumber.toLowerCase() > a.ticketNumber.toLowerCase()) ? -1 : 0));
    }
    private onFilterDescription(lines) {
        lines.sort((a, b) => (a.description.toLowerCase() > b.description.toLowerCase()) ?
            1 : ((b.description.toLowerCase() > a.description.toLowerCase()) ? -1 : 0));
    }
    private onFilterMfg(lines) {
        lines.sort((a, b) => ((a.mfg || "").toLowerCase() > (b.mfg || "").toLowerCase()) ?
            1 : (((b.mfg || "").toLowerCase() > (a.mfg || "").toLowerCase()) ? -1 : 0));
    }
    private onFilterClients(lines) {
        lines.sort((a, b) => (a.client.toLowerCase() > b.client.toLowerCase()) ?
            1 : ((b.client.toLowerCase() > a.client.toLowerCase()) ? -1 : 0));
    }
    private onFilterDate(lines) {
        lines.sort((a, b) => (a.date.toLowerCase() > b.date.toLowerCase()) ?
            1 : ((b.date.toLowerCase() > a.date.toLowerCase()) ? -1 : 0));
    }
    
}