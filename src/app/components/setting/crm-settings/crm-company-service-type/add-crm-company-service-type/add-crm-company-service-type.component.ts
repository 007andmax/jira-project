import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CrmService } from 'src/app/services/crm/crm.service';
import { CrmCompanyServiceType } from '../class/crm-company-service-type';

@Component({
  selector: 'add-crm-company-service-type',
  templateUrl: './add-crm-company-service-type.component.html',
  styleUrls: ['./add-crm-company-service-type.component.scss']
})
export class AddCrmCompanyServiceTypeComponent implements OnInit {
  name: string = "";
  disableCreate: boolean = false;
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
    if (this.name.length === 0 || this.disableCreate) return;
    this.crmService.addServiceType(this.name).pipe(map((res) => res),
      catchError(error => of(undefined)))
      .subscribe(
        () => {
          this.onClose.emit(null);
        },
        error => {
        }
      );
  }

}
