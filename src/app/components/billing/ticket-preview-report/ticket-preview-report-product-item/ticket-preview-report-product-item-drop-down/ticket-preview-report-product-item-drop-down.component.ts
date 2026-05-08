import { ChangeDetectorRef, Component, ElementRef, Input, OnInit } from '@angular/core';
import { ProductListComponent } from 'src/app/components/shared/product-list/product-list.component';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
import { ProductService } from 'src/app/services/product/product.service';
import { InventoryStateService } from 'src/app/states/inventory/inventory-state.service';
import { QuoteStateService } from 'src/app/states/quote/quote-state.service';
import { CategoryProductitem } from 'src/class/category-product-item';

@Component({
  selector: 'app-ticket-preview-report-product-item-drop-down',
  templateUrl: './ticket-preview-report-product-item-drop-down.component.html',
  styleUrls: ['./ticket-preview-report-product-item-drop-down.component.scss']
})
export class TicketPreviewReportProductItemDropDownComponent extends ProductListComponent {

}
