import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { InventoryItem } from '../class/inventory-item';
import { GlNumber } from 'src/ng2/class/gl-number/gl-number';
import { Tax } from 'src/ng2/app/interfaces/service/tax';
import { Subscription } from 'rxjs';
import { Company } from 'src/ng2/app/interfaces/company/company';
import { CategoryProduct } from 'src/ng2/app/interfaces/product/category-product';
import { InventoryValidate } from '../class/inventory-validate';
import { InventoryStateService } from 'src/ng2/app/states/inventory/inventory-state.service';
import { TaxesStateService } from 'src/ng2/app/states/taxes/taxes-state.service';
import { GlNumberStateService } from 'src/ng2/app/states/gl-number/gl-number-state.service';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
import { ProductService } from 'src/ng2/app/services/product/product.service';
import { GlNumberService } from 'src/ng2/app/services/gl-number/gl-number.service';
import { CompanyProfile } from '../../companies/class/company-profile';
import { SelectSearchComponent } from '../../shared/select-search/select-search.component';
import { TextAreaDirective } from 'src/ng2/app/directives/text-area.directive';

@Component({
  selector: 'app-inventory-edit-aside',
  templateUrl: './inventory-edit-aside.component.html',
  styleUrls: ['./inventory-edit-aside.component.scss']
})
export class InventoryEditAsideComponent implements OnInit, OnDestroy {
  description: TextAreaDirective;
  opened: boolean = false;
  inventory: InventoryItem = new InventoryItem();
  glNumbers: Array<GlNumber> = [];
  taxes: Array<Tax> = [];
  sub: Subscription = new Subscription();
  vendors: Array<Company> = [];
  companies: Array<Company> = [];
  categories: Array<CategoryProduct> = [];
  validate: InventoryValidate = new InventoryValidate();
  editVendor: Company = null;
  cost:string;
  sale:string;
  @ViewChild('addTax') containerAddTax;
  @ViewChild('glNumberSelect') glNumberSelect: SelectSearchComponent;
  @ViewChild('categoriesSelect') categoriesSelect: SelectSearchComponent;
  @ViewChild('vendorsSelect') vendorsSelect: SelectSearchComponent;
  @ViewChild(TextAreaDirective) set appTextArea(directive: TextAreaDirective) {
    this.description = directive;
  };
  constructor(private inventoryStateService: InventoryStateService,
    private taxesStateService: TaxesStateService,
    private glNumberStateService: GlNumberStateService,
    private companiesStateService: CompaniesStateService,
    private productService: ProductService,
    private elRef: ElementRef,
    public cd: ChangeDetectorRef,
    private glNumberService: GlNumberService) { }

  ngOnInit() {
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

    if (this.companiesStateService.getCompanies().length > 0) this.onInitVendors(this.companiesStateService.getCompanies());
    let getOnCompanies = this.companiesStateService.getOnCompanies().subscribe((data) => {
      this.onInitVendors(data);
    })
    this.sub.add(getOnCompanies);
    if (this.inventoryStateService.getCategories().length > 0) this.categories = this.inventoryStateService.getCategories();
    let getOnCategries = this.inventoryStateService.getOnCategries().subscribe((data) => {
      this.categories = data;
    })
    this.sub.add(getOnCategries);
    this.onEditCompany();
  }
  onEditCompany() {
    let getCompanyFromEdit = this.inventoryStateService.getInventoryFromEdit().subscribe((data: InventoryItem) => {
      this.inventory = new InventoryItem(data);
      let taxes = this.taxes.filter(item => {
        let index = this.inventory.taxIds.findIndex(taxId => taxId === item.id);
        return (index > -1) ? true : false;
      })
      this.taxesStateService.setTaxesFromtEdit(taxes);
      this.editVendor = this.vendors.find(item => item.id === this.inventory.companyId);
      this.elRef.nativeElement.querySelector("#inventory-description").value = this.inventory.description;
      this.opened = true;
      this.cost = (this.inventory.cost) ? this.inventory.cost.toFixed(2) : "0.00";
      this.sale = (this.inventory.sale) ? this.inventory.sale.toFixed(2) : "0.00";
   //   this.description.update();
      this.cd.detectChanges();
    })
    this.sub.add(getCompanyFromEdit);
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
    this.glNumberService.addGlNumber(data, "").subscribe((res: any) => {
      this.inventory.glNumber = res;
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
  onChangeCost(event) {
    this.inventory.cost = event.target.value;
  }
  onChangeSale(event) {
    this.inventory.sale = event.target.value;
  }
  public onPastDescription(value) {
    this.validate.resetDescription();
    this.inventory.description = value;
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
  close() {
    this.opened = false;
    this.glNumberSelect.clearClient();
    this.categoriesSelect.clearClient();
    this.vendorsSelect.clearClient();
    this.taxesStateService.onInitClear();
    this.elRef.nativeElement.querySelector('#inventory-description').value = '';
    this.validate = new InventoryValidate();
    this.cd.detectChanges();
  }
  save() {
    if (!this.validate.isValidate(this.inventory)) return;
    this.productService.addProduct(this.inventory.getForEdit()).subscribe(data => {
      this.close();
    })
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
