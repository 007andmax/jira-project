import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { LeftPanelStateService } from 'src/app/states/left-panel/left-panel-state.service';
import { Company } from 'src/app/interfaces/company/company';
import { AppService } from 'src/app/states/app/app.service';
import { LeftPanelService } from 'src/app/services/left-panel/left-panel.service';

@Component({
  selector: 'app-left-panel-companies',
  templateUrl: './left-panel-companies.component.html',
  styleUrls: ['./left-panel-companies.component.scss']
})
export class LeftPanelCompaniesComponent implements OnInit {
  open: boolean = false;
  showArchivedCompanies: boolean = false;
  selectedCompany: Company;
  clientType: string;
  toggleTypeCompanies: boolean = true;
  @Input() activePage: string = "";
  @Output() onGoToLink = new EventEmitter();
  @Output() onChangeState = new EventEmitter();
  @Output() onOpenPanel = new EventEmitter();
  constructor(private companiesState: CompaniesStateService,
    public appService: AppService,
    private leftPanelService: LeftPanelService,
    private leftPanelStateService: LeftPanelStateService) { }

  ngOnInit() {
    if (this.companiesState.getSelectedCompanyId()) this.toggleTypeCompanies = false;
    if (this.selectedCompany) this.toggleTypeCompanies = false;
    this.leftPanelStateService.onToggleLeftPanel.subscribe(data => {
      if (data) this.open = false;
    })
    this.leftPanelStateService.onChangeState.subscribe(state => {
      if (!this.leftPanelService.isCompanyPage(state)) this.open = false
    })
    this.leftPanelStateService.onFirstOpen.subscribe(data => {
      if (this.leftPanelService.isCompanyPage(data)) this.open = true;
    })
    this.companiesState.filter.subscribe(data => {
      this.showArchivedCompanies = (data.clientType === "ARCHIVE");
      this.clientType = (data.clientType !== "ARCHIVE") ? data.clientType : null;
    })
    this.companiesState.onChangeSelectedCompanyId.subscribe(data => {
      console.log("data", data);
      if (data) this.toggleTypeCompanies = false;
    })
  }
  getCount(clientType) {
    return this.companiesState.getCompanies().filter(item => item.accountType === "CLIENT" && item.clientType === clientType && !item.deletedAt).length;
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


  closeMobileFilter() {
    document.body.querySelector('app-left-panel-companies').classList.remove('show');
  }
  toggleFilter(event) {
    event.target.parentNode.classList.toggle('show-filter');
  }

  onShowAll() {
    this.clientType = null;
    this.showArchivedCompanies = false;
    this.leftPanelStateService.onInitFilter(null);
  }
  onShowArchived() {
    this.clientType = null;
    this.showArchivedCompanies = true;
    this.leftPanelStateService.onInitFilter("ARCHIVE");
  }

  onSetFilterClientType(data) {
    this.clientType = data;
    this.leftPanelStateService.onInitFilter(data);
  }

  public goToState(data) {
    this.onChangeState.emit(data);
  }

  public trackByIndex(index, item) {
    return index;
  }
}
