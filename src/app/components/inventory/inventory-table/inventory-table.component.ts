import { Component, OnInit, Input, ElementRef, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { InventoryItem } from '../class/inventory-item';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
import { InventoryStateService } from 'src/app/states/inventory/inventory-state.service';
import { ProductService } from 'src/app/services/product/product.service';
import { ConfirmStateService } from '../../shared/confirm/services/confirm-state.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DELETE_PRODUCT } from 'src/app/const/confirm';
import { InventoryCheckUseComponent } from '../inventory-check-use/inventory-check-use.component';
import { InventoryValidate } from '../class/inventory-validate';
import { GlNumberService } from 'src/app/services/gl-number/gl-number.service';
import { GlNumberStateService } from 'src/app/states/gl-number/gl-number-state.service';
import { Subscription } from 'rxjs';
import { CategoryProduct } from 'src/app/interfaces/product/category-product';
import { DropDownComponent } from '../../shared/drop-down/drop-down.component';
import { QuoteStateService } from 'src/app/states/quote/quote-state.service';
import { ProductType } from '../../setting/products-settings/class/product-type';

@Component({
    selector: 'app-inventory-table',
    templateUrl: './inventory-table.component.html',
    styleUrls: ['./inventory-table.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
})
export class InventoryTableComponent implements OnInit {
  inventory: InventoryItem;
  @Input() set item(value) {
    this.inventory = value;
    this.elRef.nativeElement.querySelector(".inventory-description-textarea").value = this.inventory.description;
    this.inventory.markup = this.getMarkups();
    this.cd.markForCheck();
  };
  @Input() companies;
  @Input() glNumbers;
  @Input() taxes;
  @Output() onSelectIventory = new EventEmitter<any>();
  @ViewChild('categoriesSelect', { static: true }) categoriesSelect: DropDownComponent;
  categories: Array<CategoryProduct> = [];
  validate: InventoryValidate = new InventoryValidate();
  listTypes: Array<ProductType> = [];
  sub: Subscription = new Subscription();
  constructor(private permissionsService: PermissionsService,
    private inventoryStateService: InventoryStateService,
    private confirmStateService: ConfirmStateService,
    private glNumberStateService: GlNumberStateService,
    private productService: ProductService,
    private modalService: NgbModal,
    private elRef: ElementRef,
    private quoteStateService: QuoteStateService,
    private glNumberService: GlNumberService,
    public cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    if (this.inventoryStateService.getListTypes().length > 0) {
      this.listTypes = this.inventoryStateService.getListTypes().sort((a, b) => (a.title.toLowerCase() > b.title.toLowerCase()) ?
        1 : ((b.title.toLowerCase() > a.title.toLowerCase()) ? -1 : 0));
    }
    let onGetServiceType = this.inventoryStateService.onGetListType.subscribe(data => {
      this.listTypes = data.sort((a, b) => (a.title.toLowerCase() > b.title.toLowerCase()) ?
        1 : ((b.title.toLowerCase() > a.title.toLowerCase()) ? -1 : 0));;
    })
    this.sub.add(onGetServiceType);
    if (this.glNumberStateService.getGLNumbers().length > 0) this.glNumbers = this.sortGlNumbers(this.glNumberStateService.getGLNumbers());
    let getOnGlNumbers = this.glNumberStateService.getOnGlNumbers().subscribe((data) => {
      this.glNumbers = this.sortGlNumbers(data);
      this.cd.markForCheck();
    })
    this.sub.add(getOnGlNumbers);
    if (this.inventoryStateService.getCategories().length > 0) this.categories = this.inventoryStateService.getCategories();
    let getOnCategries = this.inventoryStateService.getOnCategries().subscribe((data) => {
      this.categories = data;
      if (this.categoriesSelect) this.categoriesSelect.reset(this.categories);
      this.cd.detectChanges();
    })
    this.sub.add(getOnCategries);
    this.cd.markForCheck();
  }
  private sortGlNumbers(data) {
    return data.sort((a, b) => (a.glNumber.toLowerCase() > b.glNumber.toLowerCase()) ?
      1 : ((b.glNumber.toLowerCase() > a.glNumber.toLowerCase()) ? -1 : 0));
  }
  onChangeDescription(event) {
    this.inventory.description = event.target.value;
    this.inventory.setIsEdit(true);
    this.cd.markForCheck();
  }
  edit() {
    this.inventoryStateService.setEditInventory(this.inventory);
    this.cd.detectChanges();
  }
  delete() {
    this.confirmStateService.setConfirmAction(DELETE_PRODUCT);
    const modalRef = this.modalService.open(InventoryCheckUseComponent, { windowClass: 'xs-modal user-modal', container: "app-inventory", backdrop: 'static', keyboard: false });
    modalRef.componentInstance.inventory = this.inventory;
    this.inventoryStateService.setProductForDelete(this.inventory);
    this.cd.detectChanges();
  }
  public getGlNumberName() {
    let glNumber = this.inventory.glNumber;
    if (!glNumber) return '';
    return (glNumber.glNumber) ? glNumber.glNumber : '';
  }
  public setSelected(data) {
    this.inventory.setSelected(data);
    this.cd.markForCheck();
  }
  selectIventory(event) {
    /*  if (event.target.checked) {
        this.draftEmailStateService.addSelectedUser(this.user);
      } else {
        let list = this.draftEmailStateService.getSelectedUsers();
        let index = list.findIndex(item => item.id === this.user.id);
        if (index > -1) this.draftEmailStateService.removeSelectedUser(index);
      }*/
    this.onSelectIventory.emit(this.inventory);
    this.cd.detectChanges();
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
    if (this.inventory.cost !== value) {
      this.inventory.cost = value;
      this.inventory.markup = this.getMarkups();
      this.validate.checkPriceCost(this.inventory.sale, this.inventory.cost);
      this.inventory.setIsEdit(true);
    }
    this.cd.markForCheck();
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
    this.cd.markForCheck();
  }
  setActive(data) {
    this.inventory.setActive(data);
    this.inventory.setIsEdit(true);
    this.save();
  }
  onBlurMarkup() {
    if (this.inventory.isEdit) {
      this.validate.checkPriceCost(this.inventory.sale, this.inventory.cost);
      this.save();
    }
    this.cd.markForCheck();
  }
  onBlurCost() {
    if (this.inventory.isEdit) {
      this.validate.checkPriceCost(this.inventory.sale, this.inventory.cost);
      this.save();
    }
    this.cd.markForCheck();
  }
  onBlurSale() {
    if (this.inventory.isEdit) {
      this.validate.checkPriceCost(this.inventory.sale, this.inventory.cost);
      this.save();
    }
    this.cd.markForCheck();
  }
  changeSales(val) {
    let value = Number(val);
    if (this.inventory.sale != value) {
      this.inventory.sale = value;
      this.inventory.markup = this.getMarkups();
      this.inventory.setIsEdit(true);
    }
    this.cd.markForCheck();
  }
  save() {
    if (!this.validate.isValidate(this.inventory) || !this.inventory.isEdit) return;
    // this.inventory.description = this.elRef.nativeElement.querySelector('#inventory-description').innerHTML;
    this.inventory.setIsEdit(false);
    this.productService.editProduct(this.inventory.getForEdit()).subscribe(data => {
      this.cd.markForCheck();
    })
  }
  glDropDownItemName = (result: string) => {
    return `${result["glNumber"]} - ${(result["description"] && result["description"].length > 0) ? result["description"]
      : "No description"}`;
  };
  onSelectProuctType(data) {
    this.inventory.setProductType(data);
    this.inventory.setIsEdit(true);
    this.save();
    this.cd.markForCheck();
  }
  onAddGlNumber(data) {
    this.glNumberService.addGlNumber(data, "").subscribe((res: any) => {
      this.inventory.glNumber = res;
      this.inventory.setIsEdit(true);
      this.save();
      this.cd.markForCheck();
    })
  }
  onSelectGlNumbers(data) {
    if (data) this.inventory.glNumber = data;
    if (!data) this.inventory.glNumber = null;
    this.inventory.setIsEdit(true);
    this.save();
    this.cd.markForCheck();
  }
  onAddCategory(data) {
    this.productService.addCategory(data, null).subscribe((data: any) => {
      this.inventory.category = data;
      this.validate.resetCategory();
      this.inventory.setIsEdit(true);
      this.save();
      this.cd.markForCheck();
    })
  }
  onSelectCategory(data) {
    this.inventory.category = data;
    this.validate.resetCategory();
    this.inventory.setIsEdit(true);
    this.save();
    this.cd.markForCheck();
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
        this.cd.markForCheck();
      })
    }

  }
  public getMarkups() {
    if (this.inventory.sale > 0 && this.inventory.cost > 0) return Number(this.quoteStateService.roundToTwo((this.inventory.sale - this.inventory.cost) / this.inventory.cost * 100));
    return 0;
  }
  onEnterMarkup(event) {
    if (event.keyCode === 13) {
      this.onChangeMarkup(event.target.value);
      this.save();
      event.target.blur();
      this.cd.markForCheck();
    }
  }
  onEnterManufacture(event) {
    if (event.keyCode === 13) {
      this.onCheckManufacture(event);
      event.target.blur();
      this.cd.markForCheck();
    }
  }
  onBlurDescription(event) {
    if (this.inventory.isEdit) {
      this.onChangeDescription(event);
      this.save();
      this.cd.markForCheck();
    }
  }
  onEnterDescription(event) {
    if (!event.shiftKey && event.keyCode === 13 && this.inventory.isEdit) {
      event.preventDefault();
      this.onChangeDescription(event);
      this.save();
      event.target.blur();
      this.cd.markForCheck();
    }
  }
  onChangeMarkup(val) {
    let value = Number(val);
    if (this.inventory.markup != value) {
      this.inventory.sale = Number(this.quoteStateService.roundToTwo((value * this.inventory.cost / 100 + this.inventory.cost)));
      this.inventory.markup = value;
      this.inventory.setIsEdit(true);
      this.cd.markForCheck();
    }
  }
  onEnterCost(event) {
    if (event.keyCode === 13 && this.inventory.isEdit) {
      this.onChangeCost(event.target.value);
      this.save();
      event.target.blur();
      this.cd.markForCheck();
    }
  }
  onEnterILC(event) {
    if (event.keyCode === 13) {
      this.onCheckILC(event);
      event.target.blur();
      this.cd.markForCheck();
    }
  }
  onEnterSale(event) {
    if (event.keyCode === 13 && this.inventory.isEdit) {
      this.changeSales(event.target.value);
      this.save();
      event.target.blur();
      this.cd.markForCheck();
    }
  }
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }
  parseTotal(value) {
    return parseFloat(value.toString()).toFixed(2)
  }
}
