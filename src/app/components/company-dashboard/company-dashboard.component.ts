import { NgModule, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbDropdownToggle, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
import { AppService } from 'src/app/states/app/app.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { Company } from '../../interfaces/company/company';
import { ContractsStateService } from '../../states/contracts/contracts-state.service';
import { LeftPanelStateService } from '../../states/left-panel/left-panel-state.service';
import { fadeInAnimation } from 'src/app/animations';

@Component({
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
