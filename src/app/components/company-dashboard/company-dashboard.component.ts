
import { CommonModule } from '@angular/common';
import { NgModule, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
import { AppService } from 'src/app/states/app/app.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { Company } from '../../interfaces/company/company';
import { ContractsStateService } from '../../states/contracts/contracts-state.service';
import { LeftPanelStateService } from '../../states/left-panel/left-panel-state.service';
import { fadeInAnimation } from 'src/app/animations';
import { CompanyEditAsideComponent } from '../companies/company-edit-aside/company-edit-aside.component';
import { CompanyDashAssociateInfoComponent } from './company-dash-associate-info/company-dash-associate-info.component';
import { CompanyDashAssociateComponent } from './company-dash-associate/company-dash-associate.component';
import { CompanyDashContractComponent } from './company-dash-contract/company-dash-contract.component';
import { CompanyDashDetailComponent } from './company-dash-detail/company-dash-detail.component';
import { CompanyDashInvoiceComponent } from './company-dash-invoice/company-dash-invoice.component';
import { CompanyDashRevenueComponent } from './company-dash-revenue/company-dash-revenue.component';
import { CompanyDashTicketComponent } from './company-dash-ticket/company-dash-ticket.component';
import { CompanyDashStatsComponent } from './company-dash-stats/company-dash-stats.component';

@Component({
  standalone: true,
  imports: [CompanyDashContractComponent, CompanyDashDetailComponent, CompanyDashInvoiceComponent, CompanyDashRevenueComponent, CompanyDashStatsComponent, CompanyDashTicketComponent, CompanyEditAsideComponent, CompanyDashAssociateComponent, CompanyDashAssociateInfoComponent, CommonModule],
  selector: 'company-dashboard',
  templateUrl: './company-dashboard.component.html',
  styleUrls: ['./company-dashboard.component.scss'],
  animations: [fadeInAnimation],
  // attach the fade in animation to the host (root) element of this component
  host: { '[@fadeInAnimation]': '' },
  encapsulation: ViewEncapsulation.None
})
export class CompanyDashboardComponent implements OnInit, OnDestroy {
  showPreloader: boolean = true;
  company: Company;
  totalTickets: number = 0;
  averageResponseTime: string = '';
  companyName: string = '';
  sub: Subscription = new Subscription();

  constructor(
    public cd: ChangeDetectorRef,
    public appService: AppService,
    private permissionsService: PermissionsService,
    private companiesStateService: CompaniesStateService,
    private leftPanelStateService: LeftPanelStateService,
    public contractsStateService: ContractsStateService) { }


  ngOnInit() {
    this.leftPanelStateService.changeStateWithoutNavigate('company-dashboard');
  }

  onCompanyChanged(data) {
    this.company = data;
    this.showPreloader = false;
  }
  totalTicketsChangedHandler(data: number) {
    this.totalTickets = data;
  }

  averageResponseTimeChangedHandler(data: string) {
    this.averageResponseTime = data;
  }

  companyNameChangedHandler(name: string) {
    this.companyName = name;
  }
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }
  ngOnDestroy(): void {
    this.companiesStateService.setCompanyRoutingId(null);
  }
}
