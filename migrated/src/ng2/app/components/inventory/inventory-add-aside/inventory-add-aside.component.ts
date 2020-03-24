import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { InventoryStateService } from 'src/ng2/app/states/inventory/inventory-state.service';
import { Subscription } from 'rxjs';
import { InventoryItem } from '../class/inventory-item';
import { GlNumberStateService } from 'src/ng2/app/states/gl-number/gl-number-state.service';
import { GlNumber } from 'src/ng2/class/gl-number/gl-number';
import { Tax } from 'src/ng2/class/taxes/tax';
import { TaxesStateService } from 'src/ng2/app/states/taxes/taxes-state.service';
import { GlNumberService } from 'src/ng2/app/services/gl-number/gl-number.service';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
import { Company } from 'src/ng2/app/interfaces/company/company';
import { CategoryProduct } from 'src/ng2/app/interfaces/product/category-product';
import { ProductService } from 'src/ng2/app/services/product/product.service';
import { InventoryValidate } from '../class/inventory-validate';
import { SelectSearchComponent } from '../../shared/select-search/select-search.component';

@Component({
  selector: 'app-inventory-add-aside',
  templateUrl: './inventory-add-aside.component.html',
  styleUrls: ['./inventory-add-aside.component.scss']
})
export class InventoryAddAsideComponent implements OnInit {
  @ViewChild('addTax') containerAddTax;
  @ViewChild('glNumberSelect') glNumberSelect: SelectSearchComponent;
  @ViewChild('categoriesSelect') categoriesSelect: SelectSearchComponent;
  @ViewChild('vendorsSelect') vendorsSelect: SelectSearchComponent;
  opened: boolean = false;
  inventory: InventoryItem = new InventoryItem();
  glNumbers: Array<GlNumber> = [];
  taxes: Array<Tax> = [];
  sub: Subscription = new Subscription();
  vendors: Array<Company> = [];
  companies: Array<Company> = [];
  categories: Array<CategoryProduct> = [];
  validate: InventoryValidate = new InventoryValidate();

  constructor(private inventoryStateService: InventoryStateService,
    private taxesStateService: TaxesStateService,
    private glNumberStateService: GlNumberStateService,
    private companiesStateService: CompaniesStateService,
    private productService: ProductService,
    private elRef: ElementRef,
    private glNumberService: GlNumberService) { }

  ngOnInit() {
    if (this.glNumberStateService.getGLNumbers().length > 0) this.glNumbers = this.sortGlNumbers(this.glNumberStateService.getGLNumbers());
    let getOnGlNumbers = this.glNumberStateService.getOnGlNumbers().subscribe((data) => {
      this.glNumbers = this.sortGlNumbers(data);
      console.log("glNumbers", this.glNumbers);
    })
    console.log("glNumbers", this.glNumbers);
    this.sub.add(getOnGlNumbers);
    this.onShowAside();
    if (this.taxesStateService.getTaxes().length > 0) this.taxes = this.taxesStateService.getTaxes();
    let getOnTaxess = this.taxesStateService.onGetTaxes.subscribe((data) => {
      this.taxes = data;
    })
    this.sub.add(getOnTaxess);

    if (this.companiesStateService.getCompanies().length > 0) this.onInitVendors(this.companiesStateService.getCompanies());
    let getOnCompanies = this.companiesStateService.getOnCompanies().subscribe((data) => {
      this.onInitVendors(data);
    })
    this.sub.add(getOnCompanies);
    if (this.inventoryStateService.getCategories().length > 0) this.categories = this.inventoryStateService.getCategories();
    this.inventoryStateService.getOnCategries().subscribe((data) => {
      this.categories = data;
    })

  }
 
  onCheckILC() {
    this.productService.validateProductILC(this.inventory.ilc, '').subscribe((data: any) => {
      this.validate.resetILCIsExist();

      if (!data.value) this.validate.setILCIsExist();
    })
  }
  onCheckManufacture() {
    this.productService.validateProductManufacture(this.inventory.manufacture, '').subscribe((data: any) => {
     
      this.validate.resetManufactureIsExist();
      if (!data.value) this.validate.setManufactureIsExist();
    })
  }
  private onInitVendors(data) {
    this.vendors = data.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
      1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0)).filter(item => !item.deletedAt && !item.isDefault && item.clientType && item.clientType.toLowerCase() === 'vendor');
  }
  onAddCategory(data) {
    this.productService.addCategory(data).subscribe((data: any) => {
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
    this.glNumberService.addGlNumber(data, "").subscribe(res => {

    })
  }
  onSelectVendor(data) {
    if (data) this.inventory.companyId = data.id;
    if (!data) this.inventory.companyId = null;
  }
  onSelectGlNumbers(data) {
    if (data) this.inventory.glNumber = data;
    if (!data) this.inventory.glNumber = null;

  }
  public onChangeDescription(event) {
    this.validate.resetDescription();
    this.inventory.description = event.target.value;

  }
  public onPastDescription(value) {
    this.validate.resetDescription();
    this.inventory.description = value;
  }
  onTaxesChange(data) {
    console.log("data", data);
    this.inventory.taxIds = data.map(item => {
      return item.id;
    });
    console.log("this.inventory", this.inventory);
  }
  public onShowAside() {
    let getShowAsideForAdd = this.inventoryStateService.getShowAsideForAdd().subscribe(() => {
      this.inventory = new InventoryItem();
      this.opened = true;

    })
    this.sub.add(getShowAsideForAdd);
  }
  private sortGlNumbers(data) {
    return data.sort((a, b) => (a.glNumber.toLowerCase() > b.glNumber.toLowerCase()) ?
      1 : ((b.glNumber.toLowerCase() > a.glNumber.toLowerCase()) ? -1 : 0));
  }
  close() {
    this.opened = false;
    this.glNumberSelect.clearClient();
    this.categoriesSelect.clearClient();
    this.vendorsSelect.clearClient();
    this.taxesStateService.onInitClear();
    this.elRef.nativeElement.querySelector('#inventory-description').value = '';
    this.validate = new InventoryValidate();
  }
  add() {
    if (!this.validate.isValidate(this.inventory)) return;
    console.log("this.inventory", this.inventory);
    this.productService.addProduct(this.inventory.getForAdd()).subscribe(data => {
      console.log("data", data);
      this.close();
    })
  }
}
