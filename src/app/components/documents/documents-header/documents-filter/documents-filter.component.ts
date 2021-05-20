import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { QuoteFilter } from 'src/app/components/billing/quotes/class/quote-filter';
import { TechUsersListReportComponent } from 'src/app/components/reports/report-menu/tech-users-list-report/tech-users-list-report.component';
import { MultiDatepickerComponent } from 'src/app/components/shared/multi-datepicker/multi-datepicker.component';
import { SelectSearchComponent } from 'src/app/components/shared/select-search/select-search.component';
import { FORMAT_DATE_2 } from 'src/app/const/date-picker';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { DocumentsStateService } from 'src/app/states/documents/documents-state.service';
import { QuoteStateService } from 'src/app/states/quote/quote-state.service';
import { DocumentFilter } from '../../class/document-filter';
import * as moment from "moment";

@Component({
  selector: 'documents-filter',
  templateUrl: './documents-filter.component.html',
  styleUrls: ['./documents-filter.component.scss']
})
export class DocumentsFilterComponent implements OnInit {
  formatDate: string = FORMAT_DATE_2;
  companies = [];
  defaultDate: number = new Date().getTime();
  @ViewChild('companyDp') companyDp: SelectSearchComponent;
  @ViewChild('usersDp') usersDp: TechUsersListReportComponent;
  @ViewChild('datesDp') datesDp: MultiDatepickerComponent;
  sub: Subscription = new Subscription();
  documentsFilter: DocumentFilter = new DocumentFilter();
  @Output() changeCountFilter = new EventEmitter<any>();

  constructor(private companiesState: CompaniesStateService,
    private documentsStateService: DocumentsStateService) { }

  ngOnInit() {
    if (this.companiesState.getCompanies().length > 0) this.getClientsList(this.companiesState.getCompanies());
    let getOnCompanies = this.companiesState.getOnCompanies().subscribe((data) => {
      this.getClientsList(data);
    })
    this.sub.add(getOnCompanies);
  }

  private getClientsList(data) {
    this.companies = data.filter(item => item.accountType === 'CLIENT' && !item.deletedAt).sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
      1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));
  }
  public onClearAll() {
    this.companyDp.clearWithOutChanges();
    this.datesDp.clearWithOutChanges();
    this.usersDp.clearWithOutChanges();
    this.documentsFilter.setCategoryId(null);
    this.documentsFilter.setCompanyId(null);
    this.documentsFilter.setTags([]);
    this.documentsFilter.setUserId(null);
    this.documentsFilter.setReviewDateStart(null);
    this.documentsFilter.setReviewDateEnd(null);
    this.documentsStateService.onInitFilter(this.documentsFilter);
    this.onChangeCounterFilter();
  }
  public onSelectCompany(data) {
    this.documentsFilter.setCompanyId((data) ? data.id : null);
    this.documentsStateService.onInitFilter(this.documentsFilter);
    this.onChangeCounterFilter();
  }
  public onSelectTags(data) {
    this.documentsFilter.setTags(data);
    this.documentsStateService.onInitFilter(this.documentsFilter);
    this.onChangeCounterFilter();
  }
  onSelectTechUser(data) {
    this.documentsFilter.setUserId((data) ? data.id : null);
    this.documentsStateService.onInitFilter(this.documentsFilter);
    this.onChangeCounterFilter();
  }

  public filterByDate(value) {
    if (value.start !== '' && value.end !== '') {
      this.documentsFilter.setReviewDateStart(moment(new Date(value.start)).format('YYYY/DD/MM'));
      this.documentsFilter.setReviewDateEnd(moment(new Date(value.end)).format('YYYY/DD/MM'));
    } else {
      this.documentsFilter.setReviewDateStart(null);
      this.documentsFilter.setReviewDateEnd(null);
    }
    this.documentsStateService.onInitFilter(this.documentsFilter);
    this.onChangeCounterFilter();
  }
  public onChangeCounterFilter() {
    let count = 0;
    if (this.documentsFilter.categoryId) count++;
    if (this.documentsFilter.reviewDateStart && this.documentsFilter.reviewDateEnd) count++;
    if (this.documentsFilter.tags.length > 0) count++;
    if (this.documentsFilter.userId) count++;
    if (this.documentsFilter.companyId) count++;
    this.changeCountFilter.emit(count);
  }

}
