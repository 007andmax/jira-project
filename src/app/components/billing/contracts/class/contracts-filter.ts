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
  new CompanyFilterTop('amount', '')];
  selectedCompany: Company = null;
  selectedType: ContractsFilterType = null;
  selectedStatus: ContractsFilterStatus = null;
  selectedStartDate: number = null;
  selectedEndDate: number = null;
  constructor() { }

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
  }
  public getFilterList(list) {
    this.clearFilter();
    return list.filter((item) => this.checkFilterItem(item));
  }
  public checkFilterItem(item) {
    return ((this.selectedCompany) ? item.company.id === this.selectedCompany.id : true)
      && ((this.selectedStatus) ? item.status === this.selectedStatus.status : true)
      && ((this.selectedStartDate && this.selectedEndDate) ? item.getStartDateByMilliseconds() >= this.selectedStartDate && item.getStartDateByMilliseconds() <= this.selectedEndDate : true)
      && ((this.selectedType) ? item.type === this.selectedType.type && item.billType === this.selectedType.billType : true)
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
    }
  }
  private onFilterAmount(list) {
    list.sort((a, b) => (a.amount > b.amount) ?
      1 : ((b.amount > a.amount) ? -1 : 0));
  }
  private onFilterReviewDate(list) {
    list.sort((a, b) => (a.reviewDate > b.reviewDate) ?
      1 : ((b.reviewDate > a.reviewDate) ? -1 : 0));
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
    list.sort((a, b) => (a.company.name.toLowerCase() > b.company.name.toLowerCase()) ?
      1 : ((b.company.name.toLowerCase() > a.company.name.toLowerCase()) ? -1 : 0));
  }
  private clearFilter() {
    this.filter.forEach(item => item.filter = '');
  }
}