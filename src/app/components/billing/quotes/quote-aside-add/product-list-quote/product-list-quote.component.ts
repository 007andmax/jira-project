
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatErrorComponent } from 'src/app/components/shared/mat-error/mat-error.component';
import { ProductListComponent } from 'src/app/components/shared/product-list/product-list.component';

@Component({
  standalone: true,
  imports: [MatErrorComponent, CommonModule],
  selector: 'app-product-list-quote',
  templateUrl: './product-list-quote.component.html',
  styleUrls: ['./product-list-quote.component.scss'],
  standalone: true
})
export class ProductListQuoteComponent extends ProductListComponent {


  setProduct(productItem) {

    this.elRef.nativeElement.querySelector('#input-dropdown').value = '';
    this.products_dropDown.close();
    this.selectedProductItem.next(productItem);
    this.selectedItem = false;
  }
}
