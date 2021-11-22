import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CrmService } from 'src/app/services/crm/crm.service';
import { CrmCompanyJobType } from '../class/crm-company-job-type';

@Component({
  selector: 'add-crm-company-job-type',
  templateUrl: './add-crm-company-job-type.component.html',
  styleUrls: ['./add-crm-company-job-type.component.scss']
})
export class AddCrmCompanyJobTypeComponent implements OnInit {
  name: string = "";
  disableCreate: boolean = false;
  @Input() jobTypeList: Array<CrmCompanyJobType> = [];
  @Output() onClose: EventEmitter<any> = new EventEmitter();
  constructor(private crmService: CrmService) { }

  ngOnInit() {
  }
  checkDublicate() {
    var duplicateCategory = this.jobTypeList.filter((item) => {
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
    this.crmService.addJobType(this.name).pipe(map((res) => res),
      catchError(error => of(undefined)))
      .subscribe(
        () => {
          this.onClose.emit(null);
        },
        error => {
        }
      );
  }
  onKeyUp(event) {
    if (event.keyCode === 13) this.save();
  }
}
