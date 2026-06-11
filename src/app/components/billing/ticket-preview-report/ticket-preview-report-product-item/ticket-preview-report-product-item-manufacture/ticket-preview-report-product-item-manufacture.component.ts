import { Component, Input } from '@angular/core';
import { TicketPreviewReportProductItemDropDownComponent } from '../ticket-preview-report-product-item-drop-down/ticket-preview-report-product-item-drop-down.component';
import { TicketPreviewProduct } from '../../class/ticket-preview-product';

@Component({
  selector: 'app-ticket-preview-report-product-item-manufacture',
  templateUrl: './ticket-preview-report-product-item-manufacture.component.html',
  styleUrls: ['./ticket-preview-report-product-item-manufacture.component.scss']
})
export class TicketPreviewReportProductItemManufactureComponent extends TicketPreviewReportProductItemDropDownComponent {
  @Input() product: TicketPreviewProduct;
  @Input() isDisabled: boolean = false;
}
