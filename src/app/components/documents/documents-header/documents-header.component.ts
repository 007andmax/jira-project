import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
import { AppService } from 'src/app/states/app/app.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { LeftPanelStateService } from 'src/app/states/left-panel/left-panel-state.service';
import { DocumentsFilterComponent } from './documents-filter/documents-filter.component';
import { Subscription } from 'rxjs';
import { TicketSortBy } from '../../tickets/tickets/class/ticket-sort-by';
import { DocumentsStateService } from 'src/app/states/documents/documents-state.service';
import { DocumentFilter } from '../class/document-filter';

@Component({
  selector: 'documents-header',
  templateUrl: './documents-header.component.html',
  styleUrls: ['./documents-header.component.scss']
})
export class DocumentsHeaderComponent implements OnInit {
  toggleFilter: boolean = false;
  countFilter: number = 0;
  activePage: string = "";
  @Output() onChangeFilterField = new EventEmitter<any>();
  @Output() onSelectAll = new EventEmitter<any>();
  @Output() onSearch = new EventEmitter<any>();
  @Input() selectAll: boolean = false;
  @Input() companyId: string;
  @Input() showAssignedCompanies: boolean = false;
  filter: DocumentFilter = new DocumentFilter();
  sub: Subscription = new Subscription();
  searchText: string = "";
  /**
   * Creates an instance of the PasswordManagerComponent with the injected services
    * @param {PasswordManagerService} passwordManagerService Service to work with filters
   * @param {permissionsService} permissionsService to work with permissions service
   */
  constructor(
    private leftPanelStateService: LeftPanelStateService,
    private permissionsService: PermissionsService,
    private router: Router,
    public appService: AppService,
    private companiesStateService: CompaniesStateService,
    private documentsStateService: DocumentsStateService
  ) { }

  /**
   * Initializes Password manager header. See [ngOnInit]{@see OnInit#ngOnInit}
   */
  ngOnInit() {
    this.activePage = this.leftPanelStateService.activePage;
    let onFirstOpen = this.leftPanelStateService.onFirstOpen.subscribe(data => {
      this.activePage = data;
    })
    this.sub.add(onFirstOpen);
    let onCloseFitler = this.documentsStateService.onToggleFitler.subscribe(res => {
      this.toggleFilter = res;
    })
    this.sub.add(onCloseFitler);
    let getFilter = this.documentsStateService.filter.subscribe(data => {
      this.filter.setFilters(data)
      this.onChangeCounterFilter();
    })
    this.sub.add(getFilter);
  }
  clearSearch() {
    this.searchText = "";
    this.onSearch.emit("");
  }
  public onChangeCounterFilter() {
    this.countFilter = 0;
    if (this.filter.categoryId) this.countFilter++;
    if (this.filter.reviewDateStart && this.filter.reviewDateEnd) this.countFilter++;
    if (this.filter.tags.length > 0) this.countFilter++;
    if (this.filter.userId) this.countFilter++;
    if (this.filter.companyId) this.countFilter++;
  }
  back() {
    this.leftPanelStateService.goToState('new-documents');
  }
  getTextCountFilters() {
    return `Filters${(this.countFilter > 0) ? ' (' + this.countFilter + ')' : ''}`;
  }
  toggleAll(data) {
    this.selectAll = true;
    this.onSelectAll.emit(data);
  }

  clearAll() {
    this.documentsStateService.onClearFitler.emit(null);
  }
  public onToggleFilters(data) {
    this.toggleFilter = data;
    this.documentsStateService.onToggleFitler.emit(data);
  }
  search(event) {
    this.onSearch.emit(event.target.value);
  }
  goToAddDocument() {
    if (this.getPermissions('CREATE_DOCUMENT')) {
      this.router.navigate(
        [`${this.companiesStateService.getCurrentCompany().techDomain}/documents/add`], { queryParams: { companyId: this.companyId } });
    }
  }
  goToTemplates() {
    this.router.navigate(
      [`${this.companiesStateService.getCurrentCompany().techDomain}/documents/templates`], { queryParams: { companyId: this.companyId } });
  }
  onChangeCountFilter(data) {
    this.countFilter = data;
  }

  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
