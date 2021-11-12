import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CrmService } from 'src/app/services/crm/crm.service';

@Component({
  selector: 'add-crm-company-service-type',
  templateUrl: './add-crm-company-service-type.component.html',
  styleUrls: ['./add-crm-company-service-type.component.scss']
})
export class AddCrmCompanyServiceTypeComponent implements OnInit {
  name: string = "";
  @Output() onClose: EventEmitter<any> = new EventEmitter();
  constructor(private crmService: CrmService) { }

  ngOnInit() {
  }
  save() {
    if (this.name.length === 0) return;
    this.crmService.addServiceType(this.name).subscribe(data => {
      this.onClose.emit(null);
    })
  }

}
