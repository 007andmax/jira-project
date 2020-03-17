import { Component, OnInit, ViewChild } from '@angular/core';
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

@Component({
  selector: 'app-inventory-add-aside',
  templateUrl: './inventory-add-aside.component.html',
  styleUrls: ['./inventory-add-aside.component.scss']
})
export class InventoryAddAsideComponent implements OnInit {
  @ViewChild('addTax') containerAddTax;
  opened: boolean = false;
  inventory: InventoryItem = new InventoryItem();
  glNumbers: Array<GlNumber> = [];
  taxes: Array<Tax> = [];
  sub: Subscription = new Subscription();
  vendors: Array<Company> = [];
  companies: Array<Company> = [];
  categories: Array<CategoryProduct> = [];
  constructor(private inventoryStateService: InventoryStateService,
    private taxesStateService: TaxesStateService,
    private glNumberStateService: GlNumberStateService,
    private companiesStateService: CompaniesStateService,
    private productService: ProductService,
    private glNumberService: GlNumberService) { }

  ngOnInit() {
    if (this.glNumberStateService.getGLNumbers().length > 0) this.glNumbers = this.glNumberStateService.getGLNumbers();
    let getOnGlNumbers = this.glNumberStateService.getOnGlNumbers().subscribe((data) => {
      this.glNumbers = data;
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
    this.productService.getCategoriesProducts().subscribe((data: any) => {
      this.categories = data;
      console.log("this.categories", this.categories);
    })

  }
  private onInitVendors(data) {
    this.vendors = data.filter(item => !item.deletedAt && !item.isDefault && item.clientType && item.clientType.toLowerCase() === 'vendor');
  }
  onAddCategory(data) {
    this.productService.addCategory(data).subscribe((data: any) => {

    })
  }
  onSelectCategory(data) {
    if (data) this.inventory.category = data;
    if (data) this.inventory.category = null;
  }
  onAddGlNumber(data) {
    this.glNumberService.addGlNumber(data, "").subscribe(res => {

    })
  }
  onSelectVendor(data) {
    if (data) this.inventory.companyId = data.id;
    if (data) this.inventory.companyId = null;
  }
  onSelectGlNumbers(data) {
    if (data) this.inventory.glNumber.id = data.id;
    if (!data) this.inventory.glNumber = null;

  }
  public onChangeDescription(event) {
    this.inventory.description = event.target.value;

  }
  public onPastDescription(value) {

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
  close() {

  }
}
