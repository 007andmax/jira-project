import { Component, OnInit, ViewChild, Output, EventEmitter, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ProductService } from 'src/ng2/app/services/product/product.service';
import { Product } from 'src/ng2/app/interfaces/product/product';
import { TicketProfileFormProduct } from '../../class/ticket-profile-form-product';
import { ProductListComponent } from 'src/ng2/app/components/shared/product-list/product-list.component';
import { TicketsStateService } from 'src/ng2/app/states/tickets/tickets-state.service';
import { InventoryStateService } from 'src/ng2/app/states/inventory/inventory-state.service';
import { InventoryChange } from 'src/ng2/app/components/inventory/class/inventory-change';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ticket-profile-form-update-products',
  templateUrl: './ticket-profile-form-update-products.component.html',
  styleUrls: ['./ticket-profile-form-update-products.component.scss']
})
export class TicketProfileFormUpdateProductsComponent implements OnInit, OnDestroy {
  @ViewChild('productDP') productDP: ProductListComponent;
  addedProductList = [];
  public productList = [];
  currentProduct: TicketProfileFormProduct = new TicketProfileFormProduct();
  sub: Subscription = new Subscription();
  constructor(private productService: ProductService,
    private inventoryStateService: InventoryStateService,
    public cd: ChangeDetectorRef,
    private ticketsStateService: TicketsStateService) { }


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

      let getChangeProducts = this.inventoryStateService.getChangeProducts().subscribe((data: InventoryChange) => {
        if (data.action === 'PRODUCT_SAVED') {

          const Index = this.productList.findIndex((item) => item.id === data.data.category.id);

          if (Index > -1) {
            this.productList[Index].products.push(data.data);
          }
console.log("this.productList[Index]",this.productList[Index]);
        }
        this.productDP.onUpdateList();
        this.cd.detectChanges();
      })
      this.sub.add(getChangeProducts);

    });
  }
  public onChangeSaleProduct(val, index) {
    let value = Number(val);
    this.addedProductList[index].item.sale = value;
  }
  public onChangeCostProduct(val, index) {
    let value = Number(val);
    this.addedProductList[index].item.cost = value;
  }
  public onChangeCost(val) {
    let value = Number(val);
    this.currentProduct.item.cost = value;
  }
  public onChangeSale(val) {
    let value = Number(val);
    this.currentProduct.item.sale = value;
  }
  public onChangeProduct(item, i) {
    this.addedProductList[i].setData(item, this.getItemOrger());
  }
  public selectProduct(item) {
    if (item) this.currentProduct.setData(item, this.getItemOrger());
    if (!item) this.currentProduct = new TicketProfileFormProduct();
  }
  public addProduct() {
    this.addedProductList.push(JSON.parse(JSON.stringify(this.currentProduct)));
    this.currentProduct = new TicketProfileFormProduct();
    this.productDP.clear();

  }
  public removeProduct(i) {
    this.addedProductList.splice(i, 1);
    this.currentProduct.setItemOrder(this.getItemOrger());

  }
  private getItemOrger() {
    return (this.addedProductList.length - 1) >= 0 ? this.addedProductList.length - 1 : 0;
  }
  public trackByIndex(index, item) {
    return index;
  }
  public getSelectedProducts() {
    return (this.currentProduct.item.versionedId) ? [...this.addedProductList, this.currentProduct] : this.addedProductList;
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
