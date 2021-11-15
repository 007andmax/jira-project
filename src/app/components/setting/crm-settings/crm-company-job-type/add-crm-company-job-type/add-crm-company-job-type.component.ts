import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CrmService } from 'src/app/services/crm/crm.service';

@Component({
  selector: 'add-crm-company-job-type',
  templateUrl: './add-crm-company-job-type.component.html',
  styleUrls: ['./add-crm-company-job-type.component.scss']
})
export class AddCrmCompanyJobTypeComponent implements OnInit {
  name: string = "";
  @Output() onClose: EventEmitter<any> = new EventEmitter();
  constructor(private crmService: CrmService) { }

  ngOnInit() {
  }
  save() {
    if (this.name.length === 0) return;
    this.crmService.addJobType(this.name).subscribe(data => {
      this.onClose.emit(null);
    })
  }

}
