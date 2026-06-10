import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { DropDownComponent } from 'src/app/components/shared/drop-down/drop-down.component';
import { MatErrorComponent } from 'src/app/components/shared/mat-error/mat-error.component';

@Component({
  selector: 'contract-company-drop-down',
  templateUrl: './contract-company-drop-down.component.html',
  styleUrls: ['./contract-company-drop-down.component.scss'],
  standalone: true,
  imports: [MatErrorComponent, NgbDropdownModule, CommonModule]
})
export class ContractCompanyDropDownComponent extends DropDownComponent {
  @Input() clientType: string;
  ngOnInit() {
    if (this.class.length > 0) this.class = this.class;
    if (this.uiType) this.class.push(this.uiType);
    this.companiesService.getContractCompanies().subscribe((data: any) => {
      this.getClientsList(data);
    })
  }
  public getClientsList(data) {
    this.reset(data);
  }
}