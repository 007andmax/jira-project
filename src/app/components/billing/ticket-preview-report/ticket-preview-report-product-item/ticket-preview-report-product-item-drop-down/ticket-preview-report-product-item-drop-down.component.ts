import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, Input, OnInit } from '@angular/core';
import { NgbAccordionModule, NgbDropdown, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DynamicTooltipComponent } from 'src/app/components/shared/dynamic-tooltip/dynamic-tooltip.component';
import { ProductListComponent } from 'src/app/components/shared/product-list/product-list.component';
import { FilterPipe } from 'src/app/pipe/filter/filter.pipe';
import { ModelPipe } from 'src/app/pipe/model.pipe';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
import { ProductService } from 'src/app/services/product/product.service';
import { InventoryStateService } from 'src/app/states/inventory/inventory-state.service';
import { QuoteStateService } from 'src/app/states/quote/quote-state.service';
import { CategoryProductitem } from 'src/class/category-product-item';

@Component({
  selector: 'app-ticket-preview-report-product-item-drop-down',
  templateUrl: './ticket-preview-report-product-item-drop-down.component.html',
  styleUrls: ['./ticket-preview-report-product-item-drop-down.component.scss'],
  standalone: true,
  imports: [NgbModule, FilterPipe, CommonModule, DynamicTooltipComponent]
})
export class TicketPreviewReportProductItemDropDownComponent extends ProductListComponent {
  shortVersion: boolean = true;
  @Input() isDisabled: boolean = false;
  ngOnInit() {
    if (this.type === 'QUOTE') this.classAddProduct = 'quote-add-product';
    if (this.type === 'REPORT') this.classAddProduct = 'report-add-product';
    if (this.type === 'RECURRING-TICKET') this.classAddProduct = 'recurring-ticket-add-product';
    if (this.type === 'TICKET' || this.type === 'PRODUCTS_TICKET') this.classAddProduct = 'ticket-add-product';
    if (this.inventoryStateService.getListProducts().length > 0) this.itemList = this.inventoryStateService.getListProducts();
    let getOnProducts = this.inventoryStateService.getOnProducts().subscribe(data => {
      this.itemList = data;
      this.onUpdateList();
      this.cd.detectChanges();
    })
    this.sub.add(getOnProducts);
    this.onUpdateList();
    if (this.editItem) {
      let value = this.getNameOrDescription(this.editItem);
      if (value !== '') this.selectedItem = true;
    }
  }
  public setEditItem(data) {
    this.editItem = data;
    let value = this.getNameOrDescription(this.editItem);
    if (value !== '') this.selectedItem = true;
  }
  setProduct(productItem) {

    this.products_dropDown.close();
    this.selectedProductItem.next(productItem);
    this.selectedItem = true;
    this.elRef.nativeElement.querySelector("#search-drop-down").value = "";
  }
}
