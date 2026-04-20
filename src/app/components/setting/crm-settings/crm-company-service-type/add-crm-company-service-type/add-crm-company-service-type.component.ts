import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CrmService } from 'src/app/services/crm/crm.service';
import { CrmCompanyServiceType } from '../class/crm-company-service-type';
import { MatErrorComponent } from '../../../../shared/mat-error/mat-error.component';
import { FormsModule } from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';
import { ClickOutsideDirective } from '../../../../../directives/click-otside/click-otside.directive';

@Component({
    selector: 'add-crm-company-service-type',
    templateUrl: './add-crm-company-service-type.component.html',
    styleUrls: ['./add-crm-company-service-type.component.scss'],
    standalone: true,
    imports: [ClickOutsideDirective, NgClass, FormsModule, NgIf, MatErrorComponent]
})
export class AddCrmCompanyServiceTypeComponent implements OnInit {
  name: string = "";
  disableCreate: boolean = false;
  isInitRequest: boolean = false;
  @Input() serviceTypeList: Array<CrmCompanyServiceType> = [];
  @Output() onClose: EventEmitter<any> = new EventEmitter();
  constructor(private crmService: CrmService) { }

  ngOnInit() {
  }
  checkDublicate() {
    var duplicateCategory = this.serviceTypeList.filter((item) => {
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
    this.crmService.addServiceType(this.name).pipe(map((res) => res),
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
