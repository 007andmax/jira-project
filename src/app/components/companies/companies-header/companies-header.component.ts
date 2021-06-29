import { Component, OnInit, OnDestroy, Output, EventEmitter, ViewChild } from '@angular/core';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { DraftEmailStateService } from 'src/app/states/draft-email/draft-email-state.service';
import { CompanyCalculateCount } from '../class/company-calculate-count';
import { Subscription } from 'rxjs';
import { COMPANIES } from 'src/app/const/emails';
import { CompaniesFilterComponent } from './companies-filter/companies-filter.component';

@Component({
  selector: 'app-companies-header',
  templateUrl: './companies-header.component.html',
  styleUrls: ['./companies-header.component.scss']
})
export class CompaniesHeaderComponent implements OnInit, OnDestroy {
  toggleFilter: boolean = true;
  countFilter: number = 0;
  calculateCount: CompanyCalculateCount = new CompanyCalculateCount();
  @ViewChild('filter') filter: CompaniesFilterComponent;
  @Output() onChangeFilterField = new EventEmitter<any>();
  @Output() onSelectAllCompanies = new EventEmitter<any>();

  sub: Subscription = new Subscription();
  constructor(private companiesStateService: CompaniesStateService,
    private draftEmailStateService: DraftEmailStateService,
    private companiesState: CompaniesStateService) { }

  ngOnInit() {
    this.calculateCount = this.companiesState.getCalculateCount();
    let getOnCalculateCount = this.companiesState.getOnCalculateCount().subscribe((data) => {
      this.calculateCount = data;
    })
    this.sub.add(getOnCalculateCount);
  }
  selectAllCompanies(event) {
    this.onSelectAllCompanies.emit(event);
  }
  public getCountSelected() {
    return this.draftEmailStateService.getSelectedCompanies().length;
  }
  public showAsideForDraftEmail() {
    this.draftEmailStateService.setAction(COMPANIES);
    this.draftEmailStateService.toggleAsideForAdd();
  }
  clearAll() {
    this.filter.onClearAll();
  }
  onChangeCountFilter(data) {
    this.countFilter = data;
  }
  public showAsideForAdd() {
    this.companiesStateService.toggleAsideForAdd();
  }
  onFilter(data) {
    this.onChangeFilterField.emit(data);
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
