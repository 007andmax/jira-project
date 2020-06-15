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
    this.addedProductList[i].valdiateSaleCost  = true;
  }
  public selectProduct(item) {
    if (item) this.currentProduct.setData(item, this.getItemOrger());
    if (!item) this.currentProduct = new TicketProfileFormProduct();
    this.currentProduct.valdiateSaleCost  = true;
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
  public onValidateSaleCostProduct(i) {

    if (Number(this.addedProductList[i].item.sale) > Number(this.addedProductList[i].item.cost))  this.addedProductList[i].valdiateSaleCost = true;

  }
  public onValidateSaleCost() {
    if (this.currentProduct.item.versionedId) {
   if (Number(this.currentProduct.item.sale) > Number(this.currentProduct.item.cost)) this.currentProduct.valdiateSaleCost =  true;
    }

  }
  private getItemOrger() {
    return (this.addedProductList.length - 1) >= 0 ? this.addedProductList.length - 1 : 0;
  }
  public trackByIndex(index, item) {
    return index;
  }
  public onValidateProducts() {
    this.addedProductList.forEach((item, index) => {
      if (Number(item.item.sale) < Number(item.item.cost)) {
        item.valdiateSaleCost = false;
      } else {
        item.valdiateSaleCost = true;
      }
    })
    let find = this.addedProductList.find(item => !item.valdiateSaleCost);
    if (this.currentProduct.item.versionedId) this.currentProduct.valdiateSaleCost = Number(this.currentProduct.item.sale) < Number(this.currentProduct.item.cost) ? false : true;
    return ((find) ? false : true) && this.currentProduct.valdiateSaleCost;
  }
  public getSelectedProducts() {
    return (this.currentProduct.item.versionedId) ? [...this.addedProductList, this.currentProduct] : this.addedProductList;
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
