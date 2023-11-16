import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { TicketProfileProduct } from '../../../class/ticket-profile-product';
import { TicketProfileUpdate } from '../../../class/ticket-profile-update';
import { TicketProfileFormProduct } from '../../../ticket-edit-aside/class/ticket-profile-form-product';
import { Subscription } from 'rxjs';
import { ProductListComponent } from 'src/app/components/shared/product-list/product-list.component';
import { DisabledBtnDirective } from 'src/app/directives/disabled-btn/disabled-btn.directive';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
import { ProductService } from 'src/app/services/product/product.service';
import { InventoryStateService } from 'src/app/states/inventory/inventory-state.service';
import { TicketsStateService } from 'src/app/states/tickets/tickets-state.service';

@Component({
  selector: 'ticket-detail-profile-edit-updates-products',
  templateUrl: './ticket-detail-profile-edit-updates-products.component.html',
  styleUrls: ['./ticket-detail-profile-edit-updates-products.component.scss']
})
export class TicketDetailProfileEditUpdatesProductsComponent implements OnInit, OnDestroy {
  isUpdate: boolean = false;
  @ViewChild('updateMobileBtn') updateMobileBtn: DisabledBtnDirective;
  @ViewChild('addMoreMobileBtn') addMoreMobileBtn: DisabledBtnDirective;
  @ViewChild('productDP') productDP: ProductListComponent;
  @Output() onUpdateMobile = new EventEmitter();
  @Output() onAddMoreMobile = new EventEmitter();
  addedProductList = [];
  currentProduct: TicketProfileFormProduct = new TicketProfileFormProduct();
  sub: Subscription = new Subscription();
  constructor(private productService: ProductService,
    private inventoryStateService: InventoryStateService,
    public cd: ChangeDetectorRef,
    private permissionsService: PermissionsService,
    private ticketsStateService: TicketsStateService) { }


  initUpdateMobile() {
    this.isUpdate = true;
    this.updateMobileBtn.setDisabled(true);
    this.addMoreMobileBtn.setDisabled(true);
  }
  updateMobile() {
    this.onUpdateMobile.emit(null);
  }
  addMoreMobile() {
    this.onAddMoreMobile.emit(null);
  }
  public complateUpdateMobile() {
    this.isUpdate = false;
    this.addMoreMobileBtn.setDisabled(false);
    this.updateMobileBtn.setDisabled(false);
  }
  public onChangeSaleProduct(val, index) {
    let value = Number(val.target.value);
    this.addedProductList[index].item.sale = value;
    this.addedProductList[index].item.sale_str = value.toFixed(2);
  }
  public onChangeCostProduct(val, index) {
    let value = Number(val.target.value);
    this.addedProductList[index].item.cost = value;
    this.addedProductList[index].item.cost.str = value.toFixed(2);
  }

  public onChangeProduct(item, i, taxesDropDown) {
    this.addedProductList[i].setData(item, this.getItemOrger());
    this.addedProductList[i].valdiateSaleCost = true;
    taxesDropDown.selectedTax = item.taxes;
  }
  public onTaxesChangeProduct(data, i) {
    this.addedProductList[i].setTexes(data);
  }

  public addProduct() {
    this.addedProductList.push(new TicketProfileFormProduct(JSON.parse(JSON.stringify(this.currentProduct))));
    this.currentProduct = new TicketProfileFormProduct();
    this.productDP.clear();
  }
  public removeProduct(i) {
    this.addedProductList.splice(i, 1);
    this.currentProduct.setItemOrder(this.getItemOrger());

  }
  public onValidateSaleCostProduct(i) {

    if (Number(this.addedProductList[i].item.sale) > Number(this.addedProductList[i].item.cost)) this.addedProductList[i].valdiateSaleCost = true;

  }

  public getItemOrger() {
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
    return ((this.currentProduct.item.versionedId) ? [...this.addedProductList.filter(item => item.item.versionedId), this.currentProduct] : this.addedProductList.filter(item => item.item.versionedId)).map(item => item.getDataForAdd());
  }
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  @Input() update: TicketProfileUpdate;
  product: TicketProfileProduct = new TicketProfileProduct();
  ngOnInit() {
    this.product = new TicketProfileProduct(this.update.products[0]);
  }
  public selectProduct(item, taxesDropDown) {
    if (item) {
      this.product.setData(item, this.getItemOrger());
      taxesDropDown.selectedTax = item.taxes;
    }
    this.product.valdiateSaleCost = true;
  }
  public onChangeCost(val) {
    let value = Number(val.target.value);
    this.product.item.cost = value;
    this.product.item.cost_str = value.toFixed(2);
  }
  public onValidateSaleCost() {
    if (this.product.item.versionedId) {
      if (Number(this.product.item.sale) > Number(this.product.item.cost)) this.product.valdiateSaleCost = true;
    }
  }
  public onTaxesChange(item) {
    this.product.setTexes(item);
  }
  public onChangeSale(val) {
    let value = Number(val.target.value);
    this.product.item.sale = value;
    this.product.item.sale_str = value.toFixed(2);
  }
}
