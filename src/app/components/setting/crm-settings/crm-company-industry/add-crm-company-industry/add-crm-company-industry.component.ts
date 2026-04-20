import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CrmService } from 'src/app/services/crm/crm.service';
import { CrmCompanyIndustry } from '../class/crm-company-industry';
import { MatErrorComponent } from '../../../../shared/mat-error/mat-error.component';
import { FormsModule } from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';
import { ClickOutsideDirective } from '../../../../../directives/click-otside/click-otside.directive';

@Component({
    selector: 'add-crm-company-industry',
    templateUrl: './add-crm-company-industry.component.html',
    styleUrls: ['./add-crm-company-industry.component.scss'],
    standalone: true,
    imports: [ClickOutsideDirective, NgClass, FormsModule, NgIf, MatErrorComponent]
})
export class AddCrmCompanyIndustryComponent implements OnInit {
  name: string = "";
  disableCreate: boolean = false;
  isInitRequest: boolean = false;
  @Input() industryList: Array<CrmCompanyIndustry> = [];
  @Output() onClose: EventEmitter<any> = new EventEmitter();
  constructor(private crmService: CrmService) { }

  ngOnInit() {
  }
  checkDublicate() {
    var duplicateCategory = this.industryList.filter((item) => {
      return item.name.toLowerCase() === this.name.toLowerCase();
    });
    if (duplicateCategory && duplicateCategory[0]) {
      return this.disableCreate = true;
    } else {
      return this.disableCreate = false;
    }
  };
  save() {
    if (this.name.length === 0 || this.disableCreate || this.isInitRequest) return;
    this.isInitRequest = true;
    this.crmService.addIndustry(this.name).pipe(map((res) => res),
      catchError(error => of(undefined)))
      .subscribe(
        () => {
          this.isInitRequest = false;
          this.onClose.emit(null);
        },
        error => {
          this.isInitRequest = false;
        }
      );
  }
  onKeyUp(event) {
    if (event.keyCode === 13) this.save();
  }
}
