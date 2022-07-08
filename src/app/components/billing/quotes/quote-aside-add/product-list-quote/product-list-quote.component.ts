import { Component } from '@angular/core';
import { ProductListComponent } from 'src/app/components/shared/product-list/product-list.component';

@Component({
  selector: 'app-product-list-quote',
  templateUrl: './product-list-quote.component.html',
  styleUrls: ['./product-list-quote.component.scss']
})
export class ProductListQuoteComponent extends ProductListComponent {


  setProduct(productItem) {

    this.elRef.nativeElement.querySelector('#input-dropdown').value = '';
    this.products_dropDown.close();
    this.selectedProductItem.next(productItem);
    this.selectedItem = false;
  }
}
