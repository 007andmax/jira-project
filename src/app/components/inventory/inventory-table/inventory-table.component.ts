import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { InventoryItem } from '../class/inventory-item';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
import { InventoryStateService } from 'src/app/states/inventory/inventory-state.service';
import { ProductService } from 'src/app/services/product/product.service';
import { ConfirmStateService } from '../../shared/confirm/services/confirm-state.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DELETE_PRODUCT } from 'src/app/const/confirm';
import { ContractsService } from 'src/app/services/contracts/contracts.service';
import { ContractsStateService } from 'src/app/states/contracts/contracts-state.service';
import { InventoryCheckUseComponent } from '../inventory-check-use/inventory-check-use.component';
import { InventoryValidate } from '../class/inventory-validate';
import { GlNumberService } from 'src/app/services/gl-number/gl-number.service';
import { GlNumberStateService } from 'src/app/states/gl-number/gl-number-state.service';
import { Subscription } from 'rxjs';
import { CategoryProduct } from 'src/app/interfaces/product/category-product';
import { DropDownComponent } from '../../shared/drop-down/drop-down.component';
import { QuoteStateService } from 'src/app/states/quote/quote-state.service';

@Component({
  selector: 'app-inventory-table',
  templateUrl: './inventory-table.component.html',
  styleUrls: ['./inventory-table.component.scss']
})
export class InventoryTableComponent implements OnInit {
  inventory: InventoryItem;
  @Input() set item(value) {
    this.inventory = value;
    this.elRef.nativeElement.querySelector(".inventory-description-textarea").value = this.inventory.description;
    this.inventory.markup = this.getMarkups();
  };
  @Input() companies;
  @Input() glNumbers;
  @Input() taxes;
  @ViewChild('categoriesSelect') categoriesSelect: DropDownComponent;
  categories: Array<CategoryProduct> = [];
  validate: InventoryValidate = new InventoryValidate();
  sub: Subscription = new Subscription();
  constructor(private permissionsService: PermissionsService,
    private inventoryStateService: InventoryStateService,
    private confirmStateService: ConfirmStateService,
    private glNumberStateService: GlNumberStateService,
    private productService: ProductService,
    private modalService: NgbModal,
    private elRef: ElementRef,
    private quoteStateService: QuoteStateService,
    private glNumberService: GlNumberService
  ) { }

  ngOnInit() {
    if (this.glNumberStateService.getGLNumbers().length > 0) this.glNumbers = this.sortGlNumbers(this.glNumberStateService.getGLNumbers());
    let getOnGlNumbers = this.glNumberStateService.getOnGlNumbers().subscribe((data) => {
      this.glNumbers = this.sortGlNumbers(data);
    })
    this.sub.add(getOnGlNumbers);
    if (this.inventoryStateService.getCategories().length > 0) this.categories = this.inventoryStateService.getCategories();
    let getOnCategries = this.inventoryStateService.getOnCategries().subscribe((data) => {
      this.categories = data;
      if (this.categoriesSelect) this.categoriesSelect.reset(this.categories);
    })
    this.sub.add(getOnCategries);
  }
  private sortGlNumbers(data) {
    return data.sort((a, b) => (a.glNumber.toLowerCase() > b.glNumber.toLowerCase()) ?
      1 : ((b.glNumber.toLowerCase() > a.glNumber.toLowerCase()) ? -1 : 0));
  }
  onChangeDescription(event) {
    console.log("event.target.value", event.target.value);
    this.inventory.description = event.target.value;
    this.inventory.setIsEdit(true);
  }
  edit() {
    this.inventoryStateService.setEditInventory(this.inventory);
  }
  delete() {
    this.confirmStateService.setConfirmAction(DELETE_PRODUCT);
    const modalRef = this.modalService.open(InventoryCheckUseComponent, { windowClass: 'xs-modal user-modal', container: "app-inventory", backdrop: 'static', keyboard: false });
    modalRef.componentInstance.inventory = this.inventory;
    this.inventoryStateService.setProductForDelete(this.inventory);
  }
  public getGlNumberName() {
    let glNumber = this.inventory.glNumber;
    if (!glNumber) return '';
    return (glNumber.glNumber) ? glNumber.glNumber : '';
  }
  public getCompanyName() {
    let conpany = this.companies.find(item => item.id === this.inventory.companyId);
    return (conpany) ? conpany.name : "";
  }
  getSelectedTaxes() {
    let taxes = [];
    this.taxes.forEach(item => {
      let index = this.inventory.taxIds.findIndex(taxId => taxId === item.id);
      if (index > -1) taxes.push(item);
    })
    return taxes;
  };
  onTaxesChange(data) {
    this.inventory.taxIds = data.map(item => {
      return item.id;
    });
    this.inventory.setIsEdit(true);
    this.save();
  }
  onChangeCost(val) {
    let value = Number(val);
    this.inventory.cost = value;
    this.inventory.markup = this.getMarkups();
    this.validate.checkPriceCost(this.inventory.sale, this.inventory.cost);
    this.inventory.setIsEdit(true);
  }
  onCheckILC(event) {
    if (event.target.value != this.inventory.ilc) {
      this.inventory.ilc = event.target.value;
      this.inventory.setIsEdit(true);
      this.productService.validateProductILC(this.inventory.ilc, this.inventory.versionedId.id).subscribe((data: any) => {
        this.validate.resetILCIsExist();
        if (!data.value) {
          this.validate.setILCIsExist();
        } else {
          this.save();
        }
      })
    }

  }
  onBlurMarkup() {
    if (this.inventory.isEdit) {
      this.validate.checkPriceCost(this.inventory.sale, this.inventory.cost);
      this.save();
    }
  }
  onBlurCost() {
    if (this.inventory.isEdit) {
      this.validate.checkPriceCost(this.inventory.sale, this.inventory.cost);
      this.save();
    }

  }
  onBlurSale() {
    if (this.inventory.isEdit) {
      this.validate.checkPriceCost(this.inventory.sale, this.inventory.cost);
      this.save();
    }

  }
  changeSales(val) {
    let value = Number(val);
    this.inventory.sale = value;
    this.inventory.markup = this.getMarkups();
    this.inventory.setIsEdit(true);
  }
  save() {
    console.log("save");
    if (!this.validate.isValidate(this.inventory) || !this.inventory.isEdit) return;
    // this.inventory.description = this.elRef.nativeElement.querySelector('#inventory-description').innerHTML;
    this.inventory.setIsEdit(false);
    this.productService.editProduct(this.inventory.getForEdit()).subscribe(data => {

    })
  }
  glDropDownItemName = (result: string) => {
    return `${result["glNumber"]} - ${(result["description"] && result["description"].length > 0) ? result["description"]
      : "No description"}`;
  };
  onAddGlNumber(data) {
    this.glNumberService.addGlNumber(data, "").subscribe((res: any) => {
      this.inventory.glNumber = res;
      this.inventory.setIsEdit(true);
      this.save();
    })
  }
  onSelectGlNumbers(data) {
    if (data) this.inventory.glNumber = data;
    if (!data) this.inventory.glNumber = null;
    this.inventory.setIsEdit(true);
    this.save();
  }
  onAddCategory(data) {
    this.productService.addCategory(data, null).subscribe((data: any) => {
      this.inventory.category = data;
      this.validate.resetCategory();
      this.inventory.setIsEdit(true);
      this.save();
    })
  }
  onSelectCategory(data) {
    this.inventory.category = data;
    this.validate.resetCategory();
    this.inventory.setIsEdit(true);
    this.save();
  }
  onCheckManufacture(event) {
    if (event.target.value != this.inventory.manufacture) {
      this.inventory.manufacture = event.target.value;
      this.inventory.setIsEdit(true);
      this.productService.validateProductManufacture(this.inventory.manufacture, this.inventory.versionedId.id).subscribe((data: any) => {
        this.validate.resetManufactureIsExist();
        if (!data.value) {
          this.validate.setManufactureIsExist();
        } else {
          this.save();
        }
      })
    }

  }
  public getMarkups() {
    if (this.inventory.sale > 0 && this.inventory.cost > 0) return Math.round((this.inventory.sale - this.inventory.cost) / this.inventory.cost * 100);
    return 0;
  }
  onEnterMarkup(event) {
    if (event.keyCode === 13) {
      this.onChangeMarkup(event.target.value);
      this.save();
      event.target.blur();
    }
  }
  onEnterManufacture(event) {
    if (event.keyCode === 13) {
      this.onCheckManufacture(event);
      event.target.blur();
    }
  }
  onBlurDescription(event) {
    // console.log("event", event);
    if (this.inventory.isEdit) {
      this.onChangeDescription(event);
      this.save();
    }
  }
  onEnterDescription(event) {
    console.log("event", event.target.value);
    if (!event.shiftKey && event.keyCode === 13 && this.inventory.isEdit) {
      event.preventDefault();
      this.onChangeDescription(event);
      this.save();
      event.target.blur();
    }
  }
  onChangeMarkup(val) {
    let value = Number(val);
    this.inventory.sale = Number(this.quoteStateService.roundToTwo((value * this.inventory.cost / 100 + this.inventory.cost)));
    this.inventory.markup = this.roundingMarkup(value);
    this.inventory.setIsEdit(true);
  }
  private roundingMarkup(markup) {
    return (!this.isInteger(markup)) ? Math.ceil(markup * 10) / 10 : markup;
  }
  private isInteger(num): boolean {
    return (num ^ 0) === num;
  }
  onEnterCost(event) {
    if (event.keyCode === 13 && this.inventory.isEdit) {
      this.onChangeCost(event.target.value);
      this.save();
      event.target.blur();
    }
  }
  onEnterILC(event) {
    if (event.keyCode === 13) {
      this.onCheckILC(event);
      event.target.blur();
    }
  }
  onEnterSale(event) {
    if (event.keyCode === 13 && this.inventory.isEdit) {
      this.changeSales(event.target.value);
      this.save();
      event.target.blur();
    }
  }
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }
  parseTotal(value) {
    return parseFloat(value.toString()).toFixed(2)
  }
}
