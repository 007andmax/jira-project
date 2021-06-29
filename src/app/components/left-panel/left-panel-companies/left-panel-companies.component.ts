import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { LeftPanelService } from 'src/app/services/left-panel/left-panel.service';
import { CompaniesService } from 'src/app/services/company/companies.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { LeftPanelCompaniesFilter } from './class/left-panel-companies-filter';
import { LeftPanelStateService } from 'src/app/states/left-panel/left-panel-state.service';
import { CompanyCalculateCount } from '../../companies/class/company-calculate-count';
import { Company } from 'src/app/interfaces/company/company';

@Component({
  selector: 'app-left-panel-companies',
  templateUrl: './left-panel-companies.component.html',
  styleUrls: ['./left-panel-companies.component.scss']
})
export class LeftPanelCompaniesComponent implements OnInit {
  open: boolean = false;
  showArchivedCompanies: boolean = false;
  calculateCount: CompanyCalculateCount = new CompanyCalculateCount();
  filter: LeftPanelCompaniesFilter = new LeftPanelCompaniesFilter();
  selectedCompany: Company;
  @Input() activePage: string = "";
  @Output() onGoToLink = new EventEmitter();
  @Output() onChangeState = new EventEmitter();
  @Output() onOpenPanel = new EventEmitter();
  constructor(private companiesState: CompaniesStateService,
    private leftPanelStateService: LeftPanelStateService) { }

  ngOnInit() {
    this.calculateCount = this.companiesState.getCalculateCount();
    this.companiesState.getOnCalculateCount().subscribe((data) => {
      this.calculateCount = data;
    })
    this.leftPanelStateService.onToggleLeftPanel.subscribe(data => {
      if (data) this.open = false;
    })
    this.leftPanelStateService.onChangeState.subscribe(state => {
      if (!this.isCompanyPage(state)) this.open = false
    })
    this.leftPanelStateService.onFirstOpen.subscribe(data => {
      if (this.isCompanyPage(data)) this.open = true;
    })
  }
  public close() {
    this.open = false;
  }
  public togglePanel(data) {
    this.open = data;
  }
  public openPanel() {
    this.onOpenPanel.emit(null);
  }
  ngDoCheck() {
    if (this.companiesState.getSelectedCompanyId() && this.companiesState.getCompanies().length > 0) this.selectedCompany = this.companiesState.getCompanies().find(item => item.id === this.companiesState.getSelectedCompanyId());

  }
  public isCompanyPage(state) {
    return (state == 'new-companies' || state == 'company-dashboard' || state == 'company-tickets' || state == 'company-user' || state == 'company-devices' || state == 'company-network-scan' || state == 'company-password-manager' || state == 'company-products' || state == 'company-contracts'
      || state == 'company-documents')
  }

  closeMobileFilter() {
    document.body.querySelector('app-left-panel-companies').classList.remove('show');
  }
  toggleFilter(event) {
    event.target.parentNode.classList.toggle('show-filter');
  }

  onShowAll() {
    this.filter.setClientType(null);
    this.companiesState.setOnShowArchived(false);
    this.showArchivedCompanies = false;
    this.companiesState.setShowArchivedCompanies(false);
  }
  onShowArchived() {
    this.companiesState.setOnShowArchived(true);
    this.showArchivedCompanies = true;
    this.companiesState.setShowArchivedCompanies(true);
  }
  onSetFilterClientType(data) {
    this.calculateCount.onCulculateCurrent(data);
    this.companiesState.setCalculateCount(this.calculateCount);
    this.filter.setClientType(data);
    this.leftPanelStateService.onInitFilter(this.filter);
  }

  public goToState(data) {
    this.onChangeState.emit(data);
  }

  public trackByIndex(index, item) {
    return index;
  }
}
