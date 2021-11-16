import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CrmService } from 'src/app/services/crm/crm.service';
import { CrmCompanyIndustry } from '../class/crm-company-industry';

@Component({
  selector: 'add-crm-company-industry',
  templateUrl: './add-crm-company-industry.component.html',
  styleUrls: ['./add-crm-company-industry.component.scss']
})
export class AddCrmCompanyIndustryComponent implements OnInit {
  name: string = "";
  disableCreate: boolean = false;
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
    if (this.name.length === 0 || this.disableCreate) return;
    this.crmService.addIndustry(this.name).pipe(map((res) => res),
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
