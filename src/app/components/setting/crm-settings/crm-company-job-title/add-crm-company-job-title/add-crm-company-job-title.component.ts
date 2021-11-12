import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CrmService } from 'src/app/services/crm/crm.service';

@Component({
  selector: 'add-crm-company-job-title',
  templateUrl: './add-crm-company-job-title.component.html',
  styleUrls: ['./add-crm-company-job-title.component.scss']
})
export class AddCrmCompanyJobTitleComponent implements OnInit {
  name: string = "";
  @Output() onClose: EventEmitter<any> = new EventEmitter();
  constructor(private crmService: CrmService) { }

  ngOnInit() {
  }
  save() {
    if (this.name.length === 0) return;
    this.crmService.addJobTitle(this.name).subscribe(data => {
      this.onClose.emit(null);
    })
  }
}
