import { Component, Input } from '@angular/core';
import { OverviewReportComponent } from '../overview-report.component';
import { TicketSortBy } from 'src/app/components/tickets/tickets/class/ticket-sort-by';
import { CompanyFilterTop } from 'src/app/components/companies/class/company-filter-top';

@Component({
  selector: 'app-overview-product-sales-report',
  templateUrl: './overview-product-sales-report.component.html',
  styleUrls: ['./overview-product-sales-report.component.scss']
})
export class OverviewProductSalesReportComponent extends OverviewReportComponent {
  @Input() type!: string;
  sortBy: TicketSortBy = new TicketSortBy('Date', 'DESC');
  filter: Array<CompanyFilterTop> = [
    new CompanyFilterTop('Date', 'DESC'),
    new CompanyFilterTop('Client', ''),
    new CompanyFilterTop('MFG#', ''),
    new CompanyFilterTop('Description', ''),
    new CompanyFilterTop('Ticket number', ''),
    new CompanyFilterTop('Invoice number', ''),
    new CompanyFilterTop('Purchase cost', ''),
    new CompanyFilterTop('QTY', ''),
    new CompanyFilterTop('Sale price', ''),
    new CompanyFilterTop('Discount', '')];


  onFilter(data) {
    this.sortBy.sortBy = data;
    let index = this.filter.findIndex(item => item.field === data);
    if (index > -1) {
      let sort = this.filter[index].filter;
      if (data === 'Date') {
        this.clearFilter();
        if (sort === '' || sort === 'DESC') {
          this.filter[index].filter = 'ASC';
          this.onFilterDate(this.list);
        } else {
          this.filter[index].filter = 'DESC';
          this.list.reverse();
        }
      }
      if (data === 'Client') {
        this.clearFilter();
        if (sort === '' || sort === 'DESC') {
          this.filter[index].filter = 'ASC';
          this.onFilterClient(this.list);
        } else {
          this.filter[index].filter = 'DESC';
          this.list.reverse();
        }
      }
      if (data === 'MFG#') {
        this.clearFilter();
        if (sort === '' || sort === 'DESC') {
          this.filter[index].filter = 'ASC';
          this.onFilterMFG(this.list);
        } else {
          this.filter[index].filter = 'DESC';
          this.list.reverse();
        }
      }
      if (data === 'Description') {
        this.clearFilter();
        if (sort === '' || sort === 'DESC') {
          this.filter[index].filter = 'ASC';
          this.onFilterDescription(this.list);
        } else {
          this.filter[index].filter = 'DESC';
          this.list.reverse();
        }
      }
      if (data === 'Ticket number') {
        this.clearFilter();
        if (sort === '' || sort === 'DESC') {
          this.filter[index].filter = 'ASC';
          this.onFilterTicketNumber(this.list);
        } else {
          this.filter[index].filter = 'DESC';
          this.list.reverse();
        }
      }
      if (data === 'Invoice number') {
        this.clearFilter();
        if (sort === '' || sort === 'DESC') {
          this.filter[index].filter = 'ASC';
          this.onFilterInvoiceNumber(this.list);
        } else {
          this.filter[index].filter = 'DESC';
          this.list.reverse();
        }
      }
      if (data === 'Purchase cost') {
        this.clearFilter();
        if (sort === '' || sort === 'DESC') {
          this.filter[index].filter = 'ASC';
          this.onFilterPurchaseCost(this.list);
        } else {
          this.filter[index].filter = 'DESC';
          this.list.reverse();
        }
      }
      if (data === 'QTY') {
        this.clearFilter();
        if (sort === '' || sort === 'DESC') {
          this.filter[index].filter = 'ASC';
          this.onFilterPurchaseQTY(this.list);
        } else {
          this.filter[index].filter = 'DESC';
          this.list.reverse();
        }
      }
      if (data === 'Sale price') {
        this.clearFilter();
        if (sort === '' || sort === 'DESC') {
          this.filter[index].filter = 'ASC';
          this.onFilterSalePrice(this.list);
        } else {
          this.filter[index].filter = 'DESC';
          this.list.reverse();
        }
      }
      if (data === 'Discount') {
        this.clearFilter();
        if (sort === '' || sort === 'DESC') {
          this.filter[index].filter = 'ASC';
          this.onFilterDiscount(this.list);
        } else {
          this.filter[index].filter = 'DESC';
          this.list.reverse();
        }
      }
      this.sortBy.sortDirection = JSON.parse(JSON.stringify(this.filter[index].filter));
    }
    this.cd.detectChanges();
  }
  private onFilterDate(list) {
    list.sort((a, b) => (a[0].toLowerCase() > b[0].toLowerCase()) ?
      1 : ((b[0].toLowerCase() > a[0].toLowerCase()) ? -1 : 0));
  }
  private onFilterClient(list) {
    list.sort((a, b) => (a[1].toLowerCase() > b[1].toLowerCase()) ?
      1 : ((b[1].toLowerCase() > a[1].toLowerCase()) ? -1 : 0));
  }
  private onFilterMFG(list) {
    if (this.type === 'SUMMARY') {
      list.sort((a, b) => ((a[2] ? a[2] : '').toLowerCase() > (b[2] ? b[2] : '').toLowerCase()) ?
        1 : ((b[2] ? b[2] : '').toLowerCase() > (a[2] ? a[2] : '').toLowerCase()) ? -1 : 0);
    } else {
      list.sort((a, b) => ((a[1] ? a[1] : '').toLowerCase() > (b[1] ? b[1] : '').toLowerCase()) ?
        1 : ((b[1] ? b[1] : '').toLowerCase() > (a[1] ? a[1] : '').toLowerCase()) ? -1 : 0);
    }
  }
  private onFilterDescription(list) {
    if (this.type === 'SUMMARY') {
      list.sort((a, b) => (a[3].toLowerCase() > b[3].toLowerCase()) ?
        1 : ((b[3].toLowerCase() > a[3].toLowerCase()) ? -1 : 0));
    } else {
      list.sort((a, b) => (a[2].toLowerCase() > b[2].toLowerCase()) ?
        1 : ((b[2].toLowerCase() > a[2].toLowerCase()) ? -1 : 0));
    }
  }
  private onFilterTicketNumber(list) {
    if (this.type === 'SUMMARY') {
      list.sort((a, b) => (a[4].toLowerCase() > b[4].toLowerCase()) ?
        1 : ((b[4].toLowerCase() > a[4].toLowerCase()) ? -1 : 0));
    } else {
      list.sort((a, b) => (a[3].toLowerCase() > b[3].toLowerCase()) ?
        1 : ((b[3].toLowerCase() > a[3].toLowerCase()) ? -1 : 0));
    }
  }
  private onFilterInvoiceNumber(list) {
    if (this.type === 'SUMMARY') {
      list.sort((a, b) => ((a[5] ? a[5] : '').toLowerCase() > (b[5] ? b[5] : '').toLowerCase()) ?
        1 : ((b[5] ? b[5] : '').toLowerCase() > (a[5] ? a[5] : '').toLowerCase()) ? -1 : 0);
    } else {
      list.sort((a, b) => ((a[4] ? a[4] : '').toLowerCase() > (b[4] ? b[4] : '').toLowerCase()) ?
        1 : ((b[4] ? b[4] : '').toLowerCase() > (a[4] ? a[4] : '').toLowerCase()) ? -1 : 0);
    }
  }
  private onFilterPurchaseCost(list) {
    if (this.type === 'SUMMARY') {
      list.sort((a, b) => (Number(a[6].replace("$", "")) > Number(b[6].replace("$", ""))) ?
        1 : ((Number(b[6].replace("$", "")) > Number(a[6].replace("$", ""))) ? -1 : 0));
    } else {
      list.sort((a, b) => (Number(a[5].replace("$", "")) > Number(b[5].replace("$", ""))) ?
        1 : ((Number(b[5].replace("$", "")) > Number(a[5].replace("$", ""))) ? -1 : 0));
    }
  }
  private onFilterPurchaseQTY(list) {
    if (this.type === 'SUMMARY') {
      list.sort((a, b) => (Number(a[7]) > Number(b[7])) ?
        1 : ((Number(b[7]) > Number(a[7])) ? -1 : 0));
    } else {
      list.sort((a, b) => (Number(a[6]) > Number(b[6])) ?
        1 : ((Number(b[6]) > Number(a[6])) ? -1 : 0));
    }
  }
  private onFilterSalePrice(list) {
    if (this.type === 'SUMMARY') {
      list.sort((a, b) => (Number(a[8].replace("$", "")) > Number(b[8].replace("$", ""))) ?
        1 : ((Number(b[8].replace("$", "")) > Number(a[8].replace("$", ""))) ? -1 : 0));
    } else {
      list.sort((a, b) => (Number(a[7].replace("$", "")) > Number(b[7].replace("$", ""))) ?
        1 : ((Number(b[7].replace("$", "")) > Number(a[7].replace("$", ""))) ? -1 : 0));
    }
  }
  private onFilterDiscount(list) {
    if (this.type === 'SUMMARY') {
      list.sort((a, b) => (Number(a[9].replace("$", "").replace("%", "")) > Number(b[9].replace("$", "").replace("%", ""))) ?
        1 : ((Number(b[9].replace("$", "").replace("%", "")) > Number(a[9].replace("$", "").replace("%", ""))) ? -1 : 0));
    } else {
      list.sort((a, b) => (Number(a[8].replace("$", "").replace("%", "")) > Number(b[8].replace("$", "").replace("%", ""))) ?
        1 : ((Number(b[8].replace("$", "").replace("%", "")) > Number(a[8].replace("$", "").replace("%", ""))) ? -1 : 0));
    }
  }
  private clearFilter() {
    this.filter.forEach(item => item.filter = '');
  }
}
