import { Component, OnInit, OnDestroy, Output, EventEmitter, ViewChild } from '@angular/core';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { DraftEmailStateService } from 'src/app/states/draft-email/draft-email-state.service';
import { CompanyCalculateCount } from '../class/company-calculate-count';
import { Subscription } from 'rxjs';
import { COMPANIES } from 'src/app/const/emails';
import { CompaniesFilterComponent } from './companies-filter/companies-filter.component';
import { ConfirmComponent } from '../../shared/confirm/confirm.component';
import { ARCHIVE_COMPANY } from 'src/app/const/confirm';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmStateService } from '../../shared/confirm/services/confirm-state.service';
import { AppService } from 'src/app/states/app/app.service';
import { LeftPanelStateService } from 'src/app/states/left-panel/left-panel-state.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';

@Component({
  selector: 'app-companies-header',
  templateUrl: './companies-header.component.html',
  styleUrls: ['./companies-header.component.scss']
})
export class CompaniesHeaderComponent implements OnInit, OnDestroy {

  toggleFilter: boolean = false;
  countFilter: number = 0;
  calculateCount: CompanyCalculateCount = new CompanyCalculateCount();
  @ViewChild('filter') filter: CompaniesFilterComponent;
  @Output() onChangeFilterField = new EventEmitter<any>();
  @Output() onSelectAllCompanies = new EventEmitter<any>();

  sub: Subscription = new Subscription();
  constructor(private companiesStateService: CompaniesStateService,
    private draftEmailStateService: DraftEmailStateService,
    private modalService: NgbModal,
    public appService: AppService,
    private leftPanelStateService: LeftPanelStateService,
    private confirmStateService: ConfirmStateService,
    private usersStateService: UsersStateService,
    private companiesState: CompaniesStateService) { }

  ngOnInit() {
    this.calculateCount = this.companiesState.getCalculateCount();
    let getOnCalculateCount = this.companiesState.getOnCalculateCount().subscribe((data) => {
      this.calculateCount = data;
    })
    this.sub.add(getOnCalculateCount);
  }
  toggleAllCompanies(event) {
    this.onSelectAllCompanies.emit(event.target.checked);
  }
  clearAllSelectedCompanies() {
    this.onSelectAllCompanies.emit(false);
  }
  public getCountSelected() {
    return this.draftEmailStateService.getSelectedCompanies().length;
  }
  public showAsideForDraftEmail() {
    this.draftEmailStateService.setAction(COMPANIES);
    this.draftEmailStateService.toggleAsideForAdd();
  }
  archive() {
    this.confirmStateService.setConfirmAction(ARCHIVE_COMPANY);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal' });
    modalRef.componentInstance.message = `Do you want to archive ${this.draftEmailStateService.getSelectedCompanies()[0].name}? All related users and service agreements will be archived and all agents will be uninstalled.`;
    this.companiesStateService.setCompnayForArchive(this.draftEmailStateService.getSelectedCompanies()[0]);
  }
  toggleMobileLeftPanel() {
    this.leftPanelStateService.toggleMobileLeftPanel(true);
    this.appService.toggleMobileAside(true);
  }
  isExistFilters() {
    return this.filter.companyFilter.clientType ||
      this.filter.companyFilter.clientIndustry ||
      this.filter.companyFilter.tags.length > 0 ||
      this.filter.companyFilter.tehUser
  }
  onToggleFilter(data) {
    if (this.appService.checkMobile()) this.appService.toggleMobileAside(data);
    this.toggleFilter = data;
  }
  getClientType(clientType) {
    return clientType.toLowerCase();
  }
  clearAll() {
    this.filter.onClearAll();
  }
  onChangeCountFilter(data) {
    this.countFilter = data;
  }
  refreshFilters() {
    this.filter.applyFilters();
  }
  getUserName(id) {
    let user = this.usersStateService.getAllUsers().find(item => item.id == id);
    return `${user.firstName} ${user.lastName}`;
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
