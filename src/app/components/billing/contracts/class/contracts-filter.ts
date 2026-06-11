import { CompanyFilterTop } from '../../../companies/class/company-filter-top';
import { Company } from 'src/app/interfaces/company/company';
import { ContractsFilterType } from './contracts-filter-type';
import { ContractsFilterStatus } from './contracts-filter-status';

export class ContractsFilter {
  filter: Array<CompanyFilterTop> = [new CompanyFilterTop('company', ''),
  new CompanyFilterTop('description', ''),
  new CompanyFilterTop('type', ''),
  new CompanyFilterTop('status', ''),
  new CompanyFilterTop('start_date', ''),
  new CompanyFilterTop('review_date', ''),
  new CompanyFilterTop('end_date', ''),
  new CompanyFilterTop('amount', '')];
  selectedCompany: Company = null;
  selectedType: ContractsFilterType = null;
  selectedStatus: ContractsFilterStatus = null;
  selectedStartDate: number = null;
  selectedEndDate: number = null;
  enableInvoiceAutoCreate: boolean = null;
  manualCreateBillableItem: boolean = null;
  direction: string;
  constructor() { }

  public clearOptions() {
    this.setEnableInvoiceAutoCreate(null);
    this.setManualCreateBillableItem(null);
  }
  public setEnableInvoiceAutoCreate(data) {
    this.enableInvoiceAutoCreate = data;
  }
  public setManualCreateBillableItem(data) {
    this.manualCreateBillableItem = data;
  }
  public setCompany(data) {
    this.selectedCompany = data;
  }
  public resetDates() {
    this.selectedStartDate = null;
    this.selectedEndDate = null;
  }
  public setStatus(data) {
    this.selectedStatus = data;
  }
  public setType(data) {
    this.selectedType = data;
  }
  public setStartDate(data) {
    this.selectedStartDate = data;
  }
  public setEndDate(data) {
    this.selectedEndDate = data;
  }
  public setFilters(data) {
    this.selectedCompany = data.selectedCompany;
    this.selectedType = data.selectedType;
    this.selectedStatus = data.selectedStatus;
    this.selectedStartDate = data.selectedStartDate;
    this.selectedEndDate = data.selectedEndDate;
    this.enableInvoiceAutoCreate = data.enableInvoiceAutoCreate;
    this.manualCreateBillableItem = data.manualCreateBillableItem;
  }
  public getFilterList(list) {
    this.clearFilter();
    return list.filter((item) => this.checkFilterItem(item));
  }
  public checkFilterItem(item) {
    return ((this.selectedCompany) ? item.companyId === this.selectedCompany.id : true)
      && ((this.selectedStatus) ? item.status === this.selectedStatus.status : true)
      && ((this.selectedStartDate && this.selectedEndDate) ? item.getStartDateByMilliseconds() >= this.selectedStartDate && item.getStartDateByMilliseconds() <= this.selectedEndDate : true)
      && ((this.selectedType) ? item.type === this.selectedType.type && item.billType === this.selectedType.billType : true)
      && ((this.enableInvoiceAutoCreate != null) ? item.enableInvoiceAutoCreate === this.enableInvoiceAutoCreate : true)
      && ((this.manualCreateBillableItem != null) ? item.manualCreateBillableItem === this.manualCreateBillableItem : true)
  }
  onSort(field, list) {
    let index = this.filter.findIndex(item => item.field === field);
    if (index > -1) {
      let sort = this.filter[index].filter;
      if (field === 'company') {
        if (sort === '') this.clearFilter();
        if (sort === '' || sort === 'DESC') {
          this.filter[index].filter = 'ASC';
          this.onFilterCompanyName(list);
        } else {
          this.filter[index].filter = 'DESC';
          list.reverse();
        }
      }
      if (field === 'description') {
        if (sort === '') this.clearFilter();
        if (sort === '' || sort === 'DESC') {
          this.filter[index].filter = 'ASC';
          this.onFilterDescription(list);
        } else {
          this.filter[index].filter = 'DESC';
          list.reverse();
        }
      }
      if (field === 'type') {
        if (sort === '') this.clearFilter();
        if (sort === '' || sort === 'DESC') {
          this.filter[index].filter = 'ASC';
          this.onFilterType(list);
        } else {
          this.filter[index].filter = 'DESC';
          list.reverse();
        }
      }
      if (field === 'status') {
        if (sort === '') this.clearFilter();
        if (sort === '' || sort === 'DESC') {
          this.filter[index].filter = 'ASC';
          this.onFilterStatus(list);
        } else {
          this.filter[index].filter = 'DESC';
          list.reverse();
        }
      }
      if (field === 'start_date') {
        if (sort === '') this.clearFilter();
        if (sort === '' || sort === 'DESC') {
          this.filter[index].filter = 'ASC';
          this.onFilterStartDate(list);
        } else {
          this.filter[index].filter = 'DESC';
          list.reverse();
        }
      }
      if (field === 'review_date') {
        if (sort === '') this.clearFilter();
        if (sort === '' || sort === 'DESC') {
          this.filter[index].filter = 'ASC';
          this.onFilterReviewDate(list);
        } else {
          this.filter[index].filter = 'DESC';
          list.reverse();
        }
      }
      if (field === 'end_date') {
        if (sort === '') this.clearFilter();
        if (sort === '' || sort === 'DESC') {
          this.filter[index].filter = 'ASC';
          this.onFilterEndDate(list);
        } else {
          this.filter[index].filter = 'DESC';
          list.reverse();
        }
      }
      if (field === 'amount') {
        if (sort === '') this.clearFilter();
        if (sort === '' || sort === 'DESC') {
          this.filter[index].filter = 'ASC';
          this.onFilterAmount(list);
        } else {
          this.filter[index].filter = 'DESC';
          list.reverse();
        }
      }
      this.direction = this.filter[index].filter;
    }
  }
  public onSortList(reqList) {
    let filter = this.filter.find(item => item.filter !== '');
    let sort = filter.filter;
    if (filter.field === 'company') {
      if (sort === 'ASC') {
        this.onFilterCompanyName(reqList);
      } else {
        reqList.reverse();
      }
    }
    if (filter.field === 'description') {
      if (sort === 'ASC') {
        this.onFilterDescription(reqList);
      } else {
        reqList.reverse();
      }
    }
    if (filter.field === 'type') {
      if (sort === 'ASC') {
        this.onFilterType(reqList);
      } else {
        reqList.reverse();
      }
    }
    if (filter.field === 'status') {
      if (sort === 'ASC') {
        this.onFilterStatus(reqList);
      } else {
        reqList.reverse();
      }
    }
    if (filter.field === 'start_date') {
      if (sort === 'ASC') {
        this.onFilterStartDate(reqList);
      } else {
        reqList.reverse();
      }
    }
    if (filter.field === 'review_date') {
      if (sort === 'ASC') {
        this.onFilterReviewDate(reqList);
      } else {
        reqList.reverse();
      }
    }
    if (filter.field === 'end_date') {
      if (sort === 'ASC') {
        this.onFilterEndDate(reqList);
      } else {
        reqList.reverse();
      }
    }
    if (filter.field === 'amount') {
      if (sort === 'ASC') {
        this.onFilterAmount(reqList);
      } else {
        reqList.reverse();
      }
    }
  }
  private onFilterAmount(list) {
    list.sort((a, b) => (a.subtotalExcludingTax > b.subtotalExcludingTax) ?
      1 : ((b.subtotalExcludingTax > a.subtotalExcludingTax) ? -1 : 0));
  }
  private onFilterReviewDate(list) {
    list.sort((a, b) => (a.reviewDate > b.reviewDate) ?
      1 : ((b.reviewDate > a.reviewDate) ? -1 : 0));
  }
  private onFilterEndDate(list) {
    list.sort((a, b) => (a.endDate > b.endDate) ?
      1 : ((b.endDate > a.endDate) ? -1 : 0));
  }
  private onFilterStartDate(list) {
    list.sort((a, b) => (a.startDate > b.startDate) ?
      1 : ((b.startDate > a.startDate) ? -1 : 0));
  }
  private onFilterStatus(list) {
    list.sort((a, b) => (a.status > b.status) ?
      1 : ((b.status > a.status) ? -1 : 0));
  }
  private onFilterType(list) {
    list.sort((a, b) => {
      let billTypeA = (a.billType) ? a.billType : "";
      let billTypeB = (b.billType) ? b.billType : "";
      return (a.type > b.type && (billTypeA == billTypeB) ? true : billTypeA > billTypeB) ?
        1 : ((b.type > a.type && (billTypeB == billTypeA) ? true : billTypeB > billTypeA) ? -1 : 0)
    });
  }
  private onFilterDescription(list) {
    list.sort((a, b) => (a.description.toLowerCase() > b.description.toLowerCase()) ?
      1 : ((b.description.toLowerCase() > a.description.toLowerCase()) ? -1 : 0));
  }
  private onFilterCompanyName(list) {
    list.sort((a, b) => (a.companyName.toLowerCase() > b.companyName.toLowerCase()) ?
      1 : ((b.companyName.toLowerCase() > a.companyName.toLowerCase()) ? -1 : 0));
  }
  private clearFilter() {
    this.filter.forEach(item => item.filter = '');
  }
}