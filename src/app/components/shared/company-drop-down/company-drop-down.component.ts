import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { DropDownComponent } from '../drop-down/drop-down.component';
import { FormsModule } from '@angular/forms';
import { MatErrorComponent } from '../mat-error/mat-error.component';
import { NgClass, NgStyle, NgIf, NgFor } from '@angular/common';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'company-drop-down',
    templateUrl: './company-drop-down.component.html',
    styleUrls: ['./company-drop-down.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        NgbDropdownModule,
        NgClass,
        NgStyle,
        NgIf,
        MatErrorComponent,
        FormsModule,
        NgFor,
    ],
})
export class CompanyDropDownComponent extends DropDownComponent {
  @Input() clientType: string;
  ngOnInit() {
    if (this.class.length > 0) this.class = this.class;
    if (this.uiType) this.class.push(this.uiType);
    if (this.companiesStateService && this.companiesStateService.isInitLightAllCompanies && this.clientType == undefined) this.getClientsList(this.companiesStateService.getLightCompanies());
    if (this.companiesStateService && this.companiesStateService.isInitLightClientsCompanies && this.clientType) this.getClientsList(this.companiesStateService.getLightClientsCompanies());

    if (this.companiesStateService) {
      let onLightCompanies = this.companiesStateService.onLightCompanies.subscribe((data) => {
        if (this.clientType == undefined) this.getClientsList(data);
      })
      this.sub.add(onLightCompanies);
    }
    if (this.companiesStateService) {
      let onLightClientsCompanies = this.companiesStateService.onLightClientsCompanies.subscribe((data) => {
        if (this.clientType != undefined) this.getClientsList(data);
      })
      this.sub.add(onLightClientsCompanies);
    }
    if (this.ref) this.ref.markForCheck();
  }
  public getClientsList(data) {
    this.reset(data);
    this.ref.markForCheck();
  }
  onOpenChange(data) {
    if (data && !this.companiesStateService.isInitLightAllCompanies && this.clientType == undefined) this.companiesStateService.onInitGetLightCompanies();
    if (data && !this.companiesStateService.isInitLightClientsCompanies && this.clientType != undefined) this.companiesStateService.onInitGetLightClietnsCompanies();
    this.ref.markForCheck();
  }
  getSelectedItemText() {
    return `${this.reducerSelectedItem(this.selectedItem)}${(this.selectedItem && this.selectedItem.deletedAt) ? ' - Archived' : ''}`;
  }
}
