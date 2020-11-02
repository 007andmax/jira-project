import { ChangeDetectorRef, Component, ElementRef, EventEmitter, OnInit, Output } from '@angular/core';
import { ProductListComponent } from 'src/ng2/app/components/shared/product-list/product-list.component';
import { InventoryStateService } from 'src/ng2/app/states/inventory/inventory-state.service';

@Component({
  selector: 'app-product-list-quote',
  templateUrl: './product-list-quote.component.html',
  styleUrls: ['./product-list-quote.component.scss']
})
export class ProductListQuoteComponent extends ProductListComponent {
 
 
  onCloseProducts(open) {
    this.resetSearch = true;
    // this.cd.detectChanges();
    this.quoteStateService.setOpenProducts(open);
  }
}
