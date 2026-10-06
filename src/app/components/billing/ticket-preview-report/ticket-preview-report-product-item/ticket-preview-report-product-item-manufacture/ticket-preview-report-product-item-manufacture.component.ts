import { Component, Input } from '@angular/core';
import { TicketPreviewReportProductItemDropDownComponent } from '../ticket-preview-report-product-item-drop-down/ticket-preview-report-product-item-drop-down.component';
import { TicketPreviewProduct } from '../../class/ticket-preview-product';
import { NgbDropdown, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { DynamicTooltipComponent } from 'src/app/components/shared/dynamic-tooltip/dynamic-tooltip.component';
import { FilterPipe } from 'src/app/pipe/filter/filter.pipe';

@Component({
  selector: 'app-ticket-preview-report-product-item-manufacture',
  templateUrl: './ticket-preview-report-product-item-manufacture.component.html',
  styleUrls: ['./ticket-preview-report-product-item-manufacture.component.scss'],
  standalone: true,
  imports: [NgbModule, FilterPipe, CommonModule, DynamicTooltipComponent]
})
export class TicketPreviewReportProductItemManufactureComponent extends TicketPreviewReportProductItemDropDownComponent {
  @Input() product: TicketPreviewProduct;
  @Input() isDisabled: boolean = false;
}
