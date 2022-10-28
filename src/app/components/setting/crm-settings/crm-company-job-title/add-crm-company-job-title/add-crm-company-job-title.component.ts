import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CrmService } from 'src/app/services/crm/crm.service';
import { CrmCompanyJobTitle } from '../class/crm-company-job-title';

@Component({
  selector: 'add-crm-company-job-title',
  templateUrl: './add-crm-company-job-title.component.html',
  styleUrls: ['./add-crm-company-job-title.component.scss']
})
export class AddCrmCompanyJobTitleComponent implements OnInit {
  name: string = "";
  disableCreate: boolean = false;
  isInitRequest: boolean = false;
  @Input() jobTitleList: Array<CrmCompanyJobTitle> = [];
  @Output() onClose: EventEmitter<any> = new EventEmitter();
  constructor(private crmService: CrmService) { }

  ngOnInit() {
  }
  checkDublicate() {
    var duplicateCategory = this.jobTitleList.filter((item) => {
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
    this.crmService.addJobTitle(this.name).pipe(map((res) => res),
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
