import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { InventoryItem } from '../class/inventory-item';
import { GlNumber } from 'src/class/gl-number/gl-number';
import { Tax } from 'src/app/interfaces/service/tax';
import { Subscription } from 'rxjs';
import { Company } from 'src/app/interfaces/company/company';
import { CategoryProduct } from 'src/app/interfaces/product/category-product';
import { InventoryValidate } from '../class/inventory-validate';
import { InventoryStateService } from 'src/app/states/inventory/inventory-state.service';
import { TaxesStateService } from 'src/app/states/taxes/taxes-state.service';
import { GlNumberStateService } from 'src/app/states/gl-number/gl-number-state.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { ProductService } from 'src/app/services/product/product.service';
import { GlNumberService } from 'src/app/services/gl-number/gl-number.service';
import { DropDownComponent } from '../../shared/drop-down/drop-down.component';
import { ToastrService } from 'ngx-toastr';
import { AppStateService } from 'src/app/states/app/app-state.service';
import { TextAreaDirective } from 'src/app/directives/text-area/text-area.directive';
import { QuoteStateService } from 'src/app/states/quote/quote-state.service';
import { TaxesComponent } from '../../shared/taxes/taxes.component';
import { ProductType } from '../../setting/products-settings/class/product-type';
import { DisabledBtnDirective } from 'src/app/directives/disabled-btn/disabled-btn.directive';

@Component({
  selector: 'app-inventory-edit-aside',
  templateUrl: './inventory-edit-aside.component.html',
  styleUrls: ['./inventory-edit-aside.component.scss']
})
export class InventoryEditAsideComponent implements OnInit, OnDestroy {
  opened: boolean = false;
  inventory: InventoryItem = new InventoryItem();
  glNumbers: Array<GlNumber> = [];
  taxes: Array<Tax> = [];
  sub: Subscription = new Subscription();
  suppliers: Array<Company> = [];
  companies: Array<Company> = [];
  categories: Array<CategoryProduct> = [];
  validate: InventoryValidate = new InventoryValidate();
  editSupplier: Company = null;
  @ViewChild('addBtn', { static: true }) addBtn: DisabledBtnDirective;
  @ViewChild('addTax', { static: true }) containerAddTax;
  @ViewChild('taxesDp', { static: true }) taxesDp: TaxesComponent;
  @ViewChild('glNumberSelect', { static: true }) glNumberSelect: DropDownComponent;
  @ViewChild('categoriesSelect', { static: true }) categoriesSelect: DropDownComponent;
  @ViewChild('suppliersSelect', { static: true }) suppliersSelect: DropDownComponent;
  @ViewChild('typeSelect', { static: true }) typeSelect: DropDownComponent;
  selectedItem: any;
  listTypes: Array<ProductType> = [];
  constructor(private inventoryStateService: InventoryStateService,
    private taxesStateService: TaxesStateService,
    private glNumberStateService: GlNumberStateService,
    private companiesStateService: CompaniesStateService,
    private productService: ProductService,
    private elRef: ElementRef,
    public cd: ChangeDetectorRef,
    private quoteStateService: QuoteStateService,
    private glNumberService: GlNumberService) { }

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
    })
    this.sub.add(getOnGlNumbers);
    if (this.taxesStateService.getTaxes().length > 0) this.taxes = this.taxesStateService.getTaxes();
    let getOnTaxess = this.taxesStateService.onGetTaxes.subscribe((data) => {
      this.taxes = data;
    })
    this.sub.add(getOnTaxess);
    if (this.companiesStateService.getCompanies().length > 0) this.onInitSuppliers(this.companiesStateService.getCompanies());
    let getOnCompanies = this.companiesStateService.getOnCompanies().subscribe((data) => {
      this.onInitSuppliers(data);
    })
    this.sub.add(getOnCompanies);
    if (this.inventoryStateService.getCategories().length > 0) this.categories = this.inventoryStateService.getCategories();
    let getOnCategries = this.inventoryStateService.getOnCategries().subscribe((data) => {
      this.categories = data;
      if (this.categoriesSelect) this.categoriesSelect.reset(this.categories);
    })
    this.sub.add(getOnCategries);
    this.onEditInventory();
  }
  onEditInventory() {
    let getInventoryFromEdit = this.inventoryStateService.getInventoryFromEdit().subscribe((data: InventoryItem) => {
      this.inventory = new InventoryItem(data);
      let taxes = this.taxes.filter(item => {
        let index = this.inventory.taxIds.findIndex(taxId => taxId === item.id);
        return (index > -1) ? true : false;
      })
      this.taxesStateService.setTaxesFromtEdit(taxes);
      this.editSupplier = this.suppliers.find(item => item.id === this.inventory.companyId);
      this.elRef.nativeElement.querySelector("#inventory-description").value = this.inventory.description;
      this.opened = true;
      if (this.inventoryStateService.getListTypes().length == 0) this.inventoryStateService.onInitGetServiceTypeList();
      this.inventory.markup = this.getMarkups();
      if (this.inventory.productType) this.typeSelect.selectItemWithOutChanges(this.listTypes.find(item => item.id == this.inventory.productType.id));
      //   this.description.update();
      this.cd.detectChanges();
    })
    this.sub.add(getInventoryFromEdit);
  }
  formatterSelectedItemText() {
    return this.selectedItem ? `${this.selectedItem.glNumber} - ${this.selectedItem.description}` : "";
  }
  onCheckILC() {
    this.productService.validateProductILC(this.inventory.ilc, this.inventory.versionedId.id).subscribe((data: any) => {
      this.validate.resetILCIsExist();
      if (!data.value) this.validate.setILCIsExist();
    })
  }
  onCheckManufacture() {
    this.productService.validateProductManufacture(this.inventory.manufacture, this.inventory.versionedId.id).subscribe((data: any) => {
      this.validate.resetManufactureIsExist();
      if (!data.value) this.validate.setManufactureIsExist();
    })
  }
  private onInitSuppliers(data) {
    this.suppliers = data.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
      1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0)).filter(item => !item.deletedAt && !item.isDefault && item.clientType && item.clientType.toLowerCase() === 'supplier');
  }
  onAddCategory(data) {
    this.productService.addCategory(data, null).subscribe((data: any) => {
      this.inventory.category = data;
      this.validate.resetCategory();
    })
  }
  onSelectCategory(data) {
    if (data) {
      this.inventory.category = data;
      this.validate.resetCategory();
    }
    if (!data) this.inventory.category = null;
  }
  onAddGlNumber(data) {
    this.glNumberService.addGlNumber(data, "").subscribe((res: any) => {
      this.inventory.glNumber = res;
    })
  }
  onSelectSupplier(data) {
    if (data) {
      this.inventory.companyId = data.id;
      this.editSupplier = this.suppliers.find(item => item.id === this.inventory.companyId);
    }
    if (!data) {
      this.inventory.companyId = null;
      this.editSupplier = null;
    }

  }
  onSelectGlNumbers(data) {
    if (data) this.inventory.glNumber = data;
    if (!data) this.inventory.glNumber = null;

  }
  public onChangeDescription(event) {
    this.validate.resetDescription();
    this.inventory.description = event.target.value;
  }
  onChangeCost(val) {
    let value = Number(val);
    this.inventory.cost = value;
    this.inventory.cost_str = value.toFixed(2);
    this.inventory.markup = this.getMarkups();
  }
  changeMarkup(val) {
    let value = Number(val);
    this.inventory.sale = Number(this.quoteStateService.roundToTwo((value * this.inventory.cost / 100 + this.inventory.cost)));
    this.inventory.sale_str = this.inventory.sale.toFixed(2);
    this.inventory.markup = value;
  }
  formatterGLNumber = (result: string) => {
    return `${result["glNumber"]} - ${(result["description"] && result["description"].length > 0) ? result["description"]
      : "No description"}`;
  };
  formatterSeletedGLNumber = (result) => {
    return result ? `${result["glNumber"]} - ${(result["description"] && result["description"].length > 0) ? result["description"]
      : "No description"}` : "";
  };

  public getMarkups() {
    if (this.inventory.sale > 0 && this.inventory.cost > 0) return Number(this.quoteStateService.roundToTwo((this.inventory.sale - this.inventory.cost) / this.inventory.cost * 100));
    return 0;
  }
  onChangeSale(val) {
    let value = Number(val);
    this.inventory.sale = value;
    this.inventory.sale_str = value.toFixed(2);
    this.inventory.markup = this.getMarkups();
  }
  public onPastDescription(event) {
    this.validate.resetDescription();
    this.inventory.description = event.target.value;
  }
  onTaxesChange(data) {
    this.inventory.taxIds = data.map(item => {
      return item.id;
    });
  }
  private sortGlNumbers(data) {
    return data.sort((a, b) => (a.glNumber.toLowerCase() > b.glNumber.toLowerCase()) ?
      1 : ((b.glNumber.toLowerCase() > a.glNumber.toLowerCase()) ? -1 : 0));
  }
  getParseMoney(value) {
    return (value) ? parseFloat(value).toFixed(2) : '';
  }
  onSelectProuctType(data) {
    this.inventory.setProductType(data);
  }
  close() {
    this.opened = false;
    this.glNumberSelect.clearClient();
    this.categoriesSelect.clearClient();
    this.suppliersSelect.clearClient();
    this.taxesDp.close();
    this.elRef.nativeElement.querySelector('#inventory-description').value = '';
    this.validate = new InventoryValidate();
    this.typeSelect.clearWithOutChanges();
    this.cd.detectChanges();
  }
  save() {
    if (!this.validate.isValidate(this.inventory)) return;
    this.addBtn.setDisabled(true);
    // this.inventory.description = this.elRef.nativeElement.querySelector('#inventory-description').innerHTML;
    this.productService.editProduct(this.inventory.getForEdit()).subscribe(data => {
      this.addBtn.setDisabled(false);
      this.glNumberStateService.refreshGlNumbersCheck();
      this.close();
    }, er => {
      this.addBtn.setDisabled(false);
    })
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
