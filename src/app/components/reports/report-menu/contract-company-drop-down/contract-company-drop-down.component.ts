import { Component, Input, OnInit } from '@angular/core';
import { DropDownComponent } from 'src/app/components/shared/drop-down/drop-down.component';

@Component({
  selector: 'contract-company-drop-down',
  templateUrl: './contract-company-drop-down.component.html',
  styleUrls: ['./contract-company-drop-down.component.scss']
})
export class ContractCompanyDropDownComponent extends DropDownComponent {
  @Input() clientType: string;
  ngOnInit() {
    if (this.class.length > 0) this.class = this.class;
    if (this.uiType) this.class.push(this.uiType);
    if (this.companiesStateService.isInitContractCompanies && this.clientType == undefined) this.getClientsList(this.companiesStateService.getContractCompanies());

    this.companiesStateService.onContractCompanies.subscribe((data) => {
      if (this.clientType == undefined) this.getClientsList(data);
    })


  }
  public getClientsList(data) {
    this.reset(data);
  }
  onOpenChange(data) {
    if (data && !this.companiesStateService.isInitContractCompanies && this.clientType == undefined) this.companiesStateService.onInitGetContractCompanies();
  }
}