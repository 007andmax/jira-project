import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CustomerPortalStateService } from 'src/app/states/customer-portal/customer-portal-state.service';
import { DraftEmailStateService } from 'src/app/states/draft-email/draft-email-state.service';
import { DynamicTooltipComponent } from '../../../../shared/dynamic-tooltip/dynamic-tooltip.component';
import { NgbTooltipModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { NgIf, NgFor } from '@angular/common';

@Component({
    selector: 'invoice-export',
    templateUrl: './invoice-export.component.html',
    styleUrls: ['./invoice-export.component.scss'],
    standalone: true,
    imports: [NgIf, NgbTooltipModule, DynamicTooltipComponent, NgbDropdownModule, NgFor]
})
export class InvoiceExportComponent implements OnInit {
  listExport = ['PDF', 'CSV'];
  @Output() onPrint = new EventEmitter();
  @Output() onEmail = new EventEmitter();
  @Output() onExport = new EventEmitter();
  constructor(
    public draftEmailStateService: DraftEmailStateService,
    public customerPortalStateService: CustomerPortalStateService,) { }

  ngOnInit() {
  }
  print(type) {
    this.onPrint.emit(type);
  }
  sendEmail() {
    this.onEmail.emit(null);
  }
  onSelectExport(type) {
    this.onExport.emit(type);
  }
}
