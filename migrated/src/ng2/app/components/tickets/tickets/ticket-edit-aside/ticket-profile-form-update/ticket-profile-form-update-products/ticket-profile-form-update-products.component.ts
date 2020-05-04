import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { ProductService } from 'src/ng2/app/services/product/product.service';
import { Product } from 'src/ng2/app/interfaces/product/product';
import { TicketProfileFormProduct } from '../../class/ticket-profile-form-product';
import { ProductListComponent } from 'src/ng2/app/components/shared/product-list/product-list.component';
import { TicketsStateService } from 'src/ng2/app/states/tickets/tickets-state.service';

@Component({
  selector: 'app-ticket-profile-form-update-products',
  templateUrl: './ticket-profile-form-update-products.component.html',
  styleUrls: ['./ticket-profile-form-update-products.component.scss']
})
export class TicketProfileFormUpdateProductsComponent implements OnInit {
  @ViewChild('productDP') productDP: ProductListComponent;
  @Output() changeProducts = new EventEmitter<any>();
  addedProductList = [];
  public productList = [];
  currentProduct: TicketProfileFormProduct = new TicketProfileFormProduct();
  constructor(private productService: ProductService,
    private ticketsStateService:TicketsStateService ) { }

  ngOnInit() {
    this.ticketsStateService.getOnClearFormUpdate().subscribe(data => {
      this.addedProductList = [];
      this.currentProduct = new TicketProfileFormProduct();
      this.productDP.clear();
    })
    this.getItemListProducts();
  }
  public getItemListProducts() {
    this.productService.getCategories().subscribe((res: any) => {
      this.productList = res;

    });
  }
  public onChangeProduct(item,i) {
    this.addedProductList[i].setData(item, this.getItemOrger());
  }
  public selectProduct(item) {
    console.log("item", item);
    this.currentProduct.setData(item, this.getItemOrger());
  }
  public addProduct() {
    this.addedProductList.push(JSON.parse(JSON.stringify(this.currentProduct)));
    this.currentProduct = new TicketProfileFormProduct();
    this.productDP.clear();
    this.changeProducts.emit(this.addedProductList);
  }
  public removeProduct(i) {
    this.addedProductList.splice(i, 1);
    this.currentProduct.setItemOrder(this.getItemOrger());
    this.changeProducts.emit(this.addedProductList);
  }
  private getItemOrger() {
    return (this.addedProductList.length - 1) >= 0 ? this.addedProductList.length - 1 : 0;
  }
  public trackByIndex(index, item) {
    return index;
  }

}
