import { Component, OnInit, OnDestroy, Output, EventEmitter, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef, Input } from '@angular/core';
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
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
import { CompanyItem } from '../class/company-item';
import { CompanyFilter } from '../class/company-filter';

@Component({
  selector: 'app-companies-header',
  templateUrl: './companies-header.component.html',
  styleUrls: ['./companies-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompaniesHeaderComponent implements OnInit, OnDestroy {
  reqCompaniesList: Array<CompanyItem> = [];

  countFilter: number = 0;
  calculateCount: CompanyCalculateCount = new CompanyCalculateCount();
  companyFilter: CompanyFilter = new CompanyFilter();
  @Input() selectAll: boolean = false;
  @Output() onChangeFilterField = new EventEmitter<any>();
  @Output() onSelectAllCompanies = new EventEmitter<any>();
  @Output() onSearch = new EventEmitter<any>();
  searchText: string = "";
  sub: Subscription = new Subscription();
  constructor(private companiesStateService: CompaniesStateService,
    private draftEmailStateService: DraftEmailStateService,
    private modalService: NgbModal,
    public appService: AppService,
    private permissionsService: PermissionsService,
    private confirmStateService: ConfirmStateService,
    private usersStateService: UsersStateService,
    public cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.calculateCount = this.companiesStateService.getCalculateCount();
    let getOnCalculateCount = this.companiesStateService.getOnCalculateCount().subscribe((data) => {
      this.calculateCount = data;
      this.cd.markForCheck();
    })
    this.sub.add(getOnCalculateCount);
    this.cd.markForCheck();
  }
  clearSearch() {
    this.searchText = "";
    this.onSearch.emit("");
  }
  onKeyUp(event) {
    if (event.keyCode === 13) this.onSearch.emit(event.target.value);
  }
  public setReqCompaniesList(data) {
    this.reqCompaniesList = data;
    this.cd.markForCheck();
  }
  toggleAllCompanies(event) {
    this.selectAll = event.target.checked;
    this.onSelectAllCompanies.emit(event.target.checked);
    this.cd.detectChanges();
  }
  clearAllSelectedCompanies() {
    this.selectAll = false;
    this.onSelectAllCompanies.emit(false);
    this.cd.detectChanges();
  }
  public getCountSelected() {
    return this.reqCompaniesList.filter(item => item.selected).length;
  }
  public showAsideForDraftEmail() {
    this.draftEmailStateService.setAction(COMPANIES);
    this.draftEmailStateService.toggleAsideForAdd();
    this.cd.detectChanges();
  }
  getTextCountFilters() {
    return `Filters${(this.countFilter > 0) ? ' (' + this.countFilter + ')' : ''}`;
  }
  archive() {
    this.confirmStateService.setConfirmAction(ARCHIVE_COMPANY);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.message = `Do you want to archive ${this.draftEmailStateService.getSelectedCompanies()[0].name}? All related users and service agreements will be archived and all agents will be uninstalled.`;
    this.companiesStateService.setCompnayForArchive(this.draftEmailStateService.getSelectedCompanies()[0]);
    this.cd.detectChanges();
  }
  isExistFilters() {
    return this.companyFilter.clientType ||
      this.companyFilter.clientIndustry ||
      this.companyFilter.tags.length > 0 ||
      this.companyFilter.techUser
  }

  getClientType(clientType) {
    return clientType.toLowerCase();
  }
  clearAll() {
    // this.filter.onClearAll();
    this.cd.detectChanges();
  }

  /*  refreshFilters() {
      this.filter.applyFilters();
      this.cd.detectChanges();
    }*/
  getUserName(id) {
    let user = this.usersStateService.getAllUsers().find(item => item.id == id);
    return `${user.firstName} ${user.lastName}`;
  }
  public showAsideForAdd() {
    this.companiesStateService.toggleAsideForAdd();
    this.cd.detectChanges();
  }
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }
  onFilter(data) {
    this.onChangeFilterField.emit(data);
    this.cd.detectChanges();
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
