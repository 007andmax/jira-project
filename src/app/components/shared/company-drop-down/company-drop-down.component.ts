import { Component, Input, OnInit } from '@angular/core';
import { DropDownComponent } from '../drop-down/drop-down.component';

@Component({
  selector: 'company-drop-down',
  templateUrl: './company-drop-down.component.html',
  styleUrls: ['./company-drop-down.component.scss']
})
export class CompanyDropDownComponent extends DropDownComponent {
  @Input() clientType: string;
  ngOnInit() {
    if (this.class.length > 0) this.class = this.class;
    if (this.uiType) this.class.push(this.uiType);
    if (this.companiesStateService.getLightCompanies().length > 0 && this.clientType == undefined) this.getClientsList(this.companiesStateService.getLightCompanies());
    if (this.companiesStateService.getLightClientsCompanies().length > 0 && this.clientType) this.getClientsList(this.companiesStateService.getLightClientsCompanies());

    this.companiesStateService.onLightCompanies.subscribe((data) => {
      console.log("data", data)
      if (this.clientType == undefined) this.getClientsList(data);
    })
    this.companiesStateService.onLightClientsCompanies.subscribe((data) => {
      if (this.clientType != undefined) this.getClientsList(data);
    })

  }
  public getClientsList(data) {
    this.reset(data);
  }
  onOpenChange(data) {
    console.log("data", data);
    if (data && this.companiesStateService.getLightCompanies().length == 0 && this.clientType == undefined) this.companiesStateService.onInitGetLightCompanies();
    if (data && this.companiesStateService.getLightClientsCompanies().length == 0 && this.clientType != undefined) this.companiesStateService.onInitGetLightClietnsCompanies();

  }
}
