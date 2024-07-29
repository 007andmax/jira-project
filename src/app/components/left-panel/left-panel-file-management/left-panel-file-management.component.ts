import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { Company } from 'src/app/interfaces/company/company';
import { LeftPanelService } from 'src/app/services/left-panel/left-panel.service';
import { AppService } from 'src/app/states/app/app.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { LeftPanelStateService } from 'src/app/states/left-panel/left-panel-state.service';

@Component({
  selector: 'app-left-panel-file-management',
  templateUrl: './left-panel-file-management.component.html',
  styleUrls: ['./left-panel-file-management.component.scss']
})
export class LeftPanelFileManagementComponent implements OnInit {
  open: boolean = false;
  showArchivedCompanies: boolean = false;
  selectedCompany: Company;
  clientType: string;
  toggleTypeCompanies: boolean = true;
  sub: Subscription = new Subscription();
  @Input() activePage: string = "";
  @Output() onGoToLink = new EventEmitter();
  @Output() onChangeState = new EventEmitter();
  @Output() onOpenPanel = new EventEmitter();
  constructor(private companiesState: CompaniesStateService,
    public appService: AppService,
    private leftPanelService: LeftPanelService,
    private leftPanelStateService: LeftPanelStateService) { }


  ngOnInit() {
    if (this.companiesState.getCompanyRoutingId()) this.toggleTypeCompanies = false;
    if (this.selectedCompany) this.toggleTypeCompanies = false;
    let onToggleLeftPanel = this.leftPanelStateService.onToggleLeftPanel.subscribe(data => {
      if (data) this.open = false;
    })
    this.sub.add(onToggleLeftPanel);
    let onChangeState = this.leftPanelStateService.onChangeState.subscribe(state => {
      if (!this.leftPanelService.isCompanyPage(state)) this.open = false
    })
    this.sub.add(onChangeState);
    let onFirstOpen = this.leftPanelStateService.onFirstOpen.subscribe(data => {
      if (this.leftPanelService.isCompanyPage(data)) this.open = true;
    })
    this.sub.add(onFirstOpen);
    let filter = this.companiesState.filter.subscribe(data => {
      this.showArchivedCompanies = (data.clientType === "ARCHIVE");
      this.clientType = (data.clientType !== "ARCHIVE") ? data.clientType : null;
    })
    this.sub.add(filter);
    let onChangeSelectedCompanyId = this.companiesState.onChangeSelectedCompanyId.subscribe(data => {
      if (data) this.toggleTypeCompanies = false;
      if (!data) this.toggleTypeCompanies = true;
    })
    this.sub.add(onChangeSelectedCompanyId);
  }
  onToggleTypeCompanies() {
    if (this.selectedCompany) this.toggleTypeCompanies = !this.toggleTypeCompanies;
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
    if (this.companiesState.getCompanyRoutingId() && this.companiesState.getCompanies().length > 0) this.selectedCompany = this.companiesState.getCompanies().find(item => item.id === this.companiesState.getCompanyRoutingId());
    if (!this.companiesState.getCompanyRoutingId() && this.companiesState.getCompanies().length > 0) this.selectedCompany = null;
  }
  toggleFilter(event) {
    event.target.parentNode.classList.toggle('show-filter');
  }

  public onShowAll() {
    this.clientType = null;
    this.showArchivedCompanies = false;
    this.leftPanelStateService.onInitFilter(null);
    this.goToState('new-companies');
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
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
