import { Component, OnInit, Input, EventEmitter, Output, ViewChild, OnDestroy } from '@angular/core';
import { ContractsFilterType } from '../../class/contracts-filter-type';
import { ContractsStateService } from 'src/app/states/contracts/contracts-state.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { Subscription } from 'rxjs';
import { CompanyDropDownComponent } from 'src/app/components/shared/company-drop-down/company-drop-down.component';
import { DropDownComponent } from '../../../../shared/drop-down/drop-down.component';
import { CompanyDropDownComponent as CompanyDropDownComponent_1 } from '../../../../shared/company-drop-down/company-drop-down.component';

@Component({
    selector: 'app-contracts-aside-top',
    templateUrl: './contracts-aside-top.component.html',
    styleUrls: ['./contracts-aside-top.component.scss'],
    standalone: true,
    imports: [CompanyDropDownComponent_1, DropDownComponent]
})
export class ContractsAsideTopComponent implements OnInit, OnDestroy {
  listsTypes = [new ContractsFilterType('Hourly', 'HOURLY', null),
  new ContractsFilterType('Block Time', 'BLOCK_TIME', null),
  new ContractsFilterType('Service Contract/by device/by user', 'SERVICE_CONTRACT_DEVICE', null),
  new ContractsFilterType('Subscriptions', 'SERVICE_CONTRACT', 'OTHER')];
  @Input() selectedType = new ContractsFilterType('Hourly', 'HOURLY', null);
  @Input() validateCompany: boolean = true;
  @Input() validateServicesDate: boolean = true;
  @Output() onSelectCompany = new EventEmitter<any>();
  @ViewChild('companiesDP', { static: true }) companiesDP: CompanyDropDownComponent;
  sub: Subscription = new Subscription();
  constructor(private contractsStateService: ContractsStateService,
    private companiesState: CompaniesStateService,) { }


  ngOnInit() {
    if (this.companiesState.getLightClientsCompanies().length > 0 && this.companiesState.getCompanyRoutingId()) this.getClientsList(this.companiesState.getLightClientsCompanies());
    if (this.companiesState.getLightClientsCompanies().length == 0 && this.companiesState.getCompanyRoutingId()) this.companiesState.onInitGetLightClietnsCompanies();
    let getOnCompanies = this.companiesState.onLightClientsCompanies.subscribe((data) => {
      this.companiesDP.onSelect(data.find(item => item.id === this.companiesState.getCompanyRoutingId()));
    })
    this.sub.add(getOnCompanies);
  }
  getClientsList(data) {
    this.companiesDP.onSelect(data.find(item => item.id === this.companiesState.getCompanyRoutingId()));
  }
  onSelectType(data) {
    this.contractsStateService.setType(data);
  }
  selectCompany(item) {
    this.onSelectCompany.emit(item);
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
