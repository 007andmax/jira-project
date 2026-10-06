
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgbDropdownModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatErrorComponent } from 'src/app/components/shared/mat-error/mat-error.component';
import { ProductListComponent } from 'src/app/components/shared/product-list/product-list.component';
import { FilterPipe } from 'src/app/pipe/filter/filter.pipe';

@Component({
  standalone: true,
  imports: [MatErrorComponent, FilterPipe, CommonModule, NgbDropdownModule, NgbModule],
  selector: 'app-product-list-quote',
  templateUrl: './product-list-quote.component.html',
  styleUrls: ['./product-list-quote.component.scss'],

})
export class ProductListQuoteComponent extends ProductListComponent {


  setProduct(productItem) {

    this.elRef.nativeElement.querySelector('#input-dropdown').value = '';
    this.products_dropDown.close();
    this.selectedProductItem.next(productItem);
    this.selectedItem = false;
  }
}
