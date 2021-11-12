import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CrmService } from 'src/app/services/crm/crm.service';

@Component({
  selector: 'add-crm-company-industry',
  templateUrl: './add-crm-company-industry.component.html',
  styleUrls: ['./add-crm-company-industry.component.scss']
})
export class AddCrmCompanyIndustryComponent implements OnInit {
  name: string = "";
  @Output() onClose: EventEmitter<any> = new EventEmitter();
  constructor(private crmService: CrmService) { }

  ngOnInit() {
  }
  save() {
    if (this.name.length === 0) return;
    this.crmService.addIndustry(this.name).subscribe(data => {
      this.onClose.emit(null);
    })
  }
}
