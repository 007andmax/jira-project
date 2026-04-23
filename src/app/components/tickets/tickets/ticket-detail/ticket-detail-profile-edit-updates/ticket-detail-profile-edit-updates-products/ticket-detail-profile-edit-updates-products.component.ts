
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { TicketProfileProduct } from '../../../class/ticket-profile-product';
import { TicketProfileUpdate } from '../../../class/ticket-profile-update';
import { TicketProfileFormProduct } from '../../../ticket-edit-aside/class/ticket-profile-form-product';
import { Subscription } from 'rxjs';
import { ProductListComponent } from 'src/app/components/shared/product-list/product-list.component';
import { DisabledBtnDirective } from 'src/app/directives/disabled-btn/disabled-btn.directive';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
import { TaxesStateService } from 'src/app/states/taxes/taxes-state.service';
import { InvoiceFormTicketEditTaxesComponent } from 'src/app/components/billing/billable/billable-aside/invoice-form/invoice-form-ticket-edit/invoice-form-ticket-edit-taxes/invoice-form-ticket-edit-taxes.component';
import { MatErrorComponent } from 'src/app/components/shared/mat-error/mat-error.component';

@Component({
  standalone: true,
  imports: [MatErrorComponent, FormsModule, CommonModule],
  selector: 'ticket-detail-profile-edit-updates-products',
  templateUrl: './ticket-detail-profile-edit-updates-products.component.html',
  styleUrls: ['./ticket-detail-profile-edit-updates-products.component.scss']
})
export class TicketDetailProfileEditUpdatesProductsComponent implements OnInit, OnDestroy {
  isUpdate: boolean = false;
  @Input() update: TicketProfileUpdate;
  product: TicketProfileProduct = new TicketProfileProduct();
  @ViewChild('taxesDropDown', { static: true }) taxesDropDown: InvoiceFormTicketEditTaxesComponent;
  @ViewChild('updateMobileBtn', { static: true }) updateMobileBtn: DisabledBtnDirective;
  @ViewChild('addMoreMobileBtn', { static: true }) addMoreMobileBtn: DisabledBtnDirective;
  @ViewChild('productDP', { static: true }) productDP: ProductListComponent;
  @Output() onUpdateMobile = new EventEmitter();
  @Output() onAddMoreMobile = new EventEmitter();
  addedProductList = [];
  currentProduct: TicketProfileFormProduct = new TicketProfileFormProduct();
  sub: Subscription = new Subscription();
  constructor(public cd: ChangeDetectorRef,
    private permissionsService: PermissionsService,
    private taxesStateService: TaxesStateService) { }


  initUpdateMobile() {
    this.isUpdate = true;
  }
  updateMobile() {
    this.onUpdateMobile.emit(null);
  }
  addMoreMobile() {
    this.onAddMoreMobile.emit(null);
  }
  public complateUpdateMobile() {
    this.isUpdate = false;
  }
  public onChangeSaleProduct(val, index) {
    let value = Number(val);
    this.addedProductList[index].item.sale = value;
    this.addedProductList[index].item.sale_str = value.toFixed(2);
  }
  public onChangeCostProduct(val, index) {
    let value = Number(val);
    this.addedProductList[index].item.cost = value;
    this.addedProductList[index].item.cost_str = value.toFixed(2);
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
  ngOnInit() {
    this.product = new TicketProfileProduct(this.update.products[0]);
    if (this.taxesStateService.getTaxes().length > 0) this.onSetEditTaxes(this.taxesStateService.getTaxes());
    let getOnTaxess = this.taxesStateService.onGetTaxes.subscribe((data) => {
      this.onSetEditTaxes(data);
    })
    this.sub.add(getOnTaxess);
  }
  onSetEditTaxes(list) {
    let notFindTax = [];
    let taxes = list.filter(item => {
      let index = this.product.taxes.findIndex(tax => tax.name === item.name && tax.rate === item.rate);
      return (index > -1) ? true : false;
    })
    this.product.taxes.forEach(item => {
      let index = list.findIndex(tax => tax.name === item.name && tax.rate === item.rate);
      if (index === -1) {
        this.taxesDropDown.addTax(item);
        notFindTax.push(item);
      }
    });
    taxes = [...taxes, ...notFindTax];
    this.taxesDropDown.setEditItems(taxes);
  }
  public selectProduct(item, taxesDropDown) {
    if (item) {
      this.product.setData(item, this.getItemOrger());
      taxesDropDown.selectedTax = item.taxes;
    }
    this.product.valdiateSaleCost = true;
  }
  public onChangeCost(val) {
    let value = Number(val);
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
    let value = Number(val);
    this.product.item.sale = value;
    this.product.item.sale_str = value.toFixed(2);
  }
}
