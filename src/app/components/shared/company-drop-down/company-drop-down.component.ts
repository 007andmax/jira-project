import { Component, OnInit } from '@angular/core';
import { DropDownComponent } from '../drop-down/drop-down.component';

@Component({
  selector: 'company-drop-down',
  templateUrl: './company-drop-down.component.html',
  styleUrls: ['./company-drop-down.component.scss']
})
export class CompanyDropDownComponent extends DropDownComponent {

  ngOnInit() {
    if (this.class.length > 0) this.class = this.class;
    if (this.uiType) this.class.push(this.uiType);
    if (this.companiesStateService.getLightCompanies().length > 0) this.getClientsList(this.companiesStateService.getLightCompanies());
    let getOnCompanies = this.companiesStateService.onLightCompanies.subscribe((data) => {
      this.getClientsList(data);
    })

  }
  public getClientsList(data) {
    this.reset(data);
  }
  onOpenChange(data) {
    console.log("data", data);
    if (data && this.companiesStateService.getLightCompanies().length == 0) this.companiesStateService.onInitGetLightCompanies();
  }
}
