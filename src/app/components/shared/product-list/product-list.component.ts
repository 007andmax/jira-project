import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ElementRef, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { InventoryStateService } from 'src/app/states/inventory/inventory-state.service';
import { Subscription } from 'rxjs';
import { CategoryProductitem } from 'src/class/category-product-item';
import { QuoteStateService } from 'src/app/states/quote/quote-state.service';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
import { ProductService } from 'src/app/services/product/product.service';

/**
 * Product list component
 */
@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit, OnDestroy {
  @ViewChild('products', { static: true }) products_dropDown: NgbDropdown;
  @Output() selectedProductItem = new EventEmitter<any>();
  itemList: Array<CategoryProductitem> = [];
  @Input() editItem: any;
  @Input() type: string;
  @Input() needArchived: boolean = false;
  @Input() validate: boolean = true;
  classAddProduct: string
  public isFormValid = false;
  search: string = '';
  resetSearch: boolean = false;
  selectedItem = false;
  sub: Subscription = new Subscription();
  /**
   * Creates an instance of the ProductListComponent with the injected services
   * @param {ElementRef} elRef Service to work with template
   */
  constructor(public elRef: ElementRef,
    public cd: ChangeDetectorRef,
    public quoteStateService: QuoteStateService,
    private permissionsService: PermissionsService,
    private productService: ProductService,
    public inventoryStateService: InventoryStateService) { }


  /**
   * Initializes product list. See [ngOnInit]{@see OnInit#ngOnInit}
   */
  ngOnInit() {
    if (this.type === 'QUOTE') this.classAddProduct = 'quote-add-product';
    if (this.type === 'REPORT') this.classAddProduct = 'report-add-product';
    if (this.type === 'RECURRING-TICKET') this.classAddProduct = 'recurring-ticket-add-product';
    if (this.type === 'TICKET' || this.type === 'PRODUCTS_TICKET') this.classAddProduct = 'ticket-add-product';
    if (this.type !== 'RECURRING-TICKET' && this.type !== 'PRODUCTS_TICKET' && this.type !== 'REPORT') this.inventoryStateService.getProducts();
    if (this.type === 'REPORT') {
      this.productService.getCategories(this.needArchived).subscribe((res: any) => {
        this.itemList = res;
        this.inventoryStateService.setPreloader(false);
        this.onUpdateList();
        this.cd.detectChanges();
      });
    }
    if (this.inventoryStateService.getListProducts().length > 0) this.itemList = this.inventoryStateService.getListProducts();
    let getOnProducts = this.inventoryStateService.getOnProducts().subscribe(data => {
      this.itemList = data;
      this.onUpdateList();
      this.cd.detectChanges();
    })
    this.sub.add(getOnProducts);
    this.onUpdateList();
    if (this.editItem) {
      let value = this.getNameOrDescription(this.editItem);
      this.elRef.nativeElement.querySelector('#dropdownProducts').value = value;
      if (value !== '') this.selectedItem = true;
      console.log("value", value);
    }
  }
  public onFocus(event) {
    if (!this.products_dropDown.isOpen()) this.products_dropDown.open();
  }
  public onUpdateList() {
    this.itemList.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
      1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));
    this.itemList.forEach(item => item.products.sort((a, b) => (a.description.toLowerCase() > b.description.toLowerCase()) ?
      1 : ((b.description.toLowerCase() > a.description.toLowerCase()) ? -1 : 0)));

  }
  public setEditItem(data) {
    this.editItem = data;
    let value = this.getNameOrDescription(this.editItem);
    this.elRef.nativeElement.querySelector('#dropdownProducts').value = value;
    if (value !== '') this.selectedItem = true;

  }


  onCreateProduct() {
    this.products_dropDown.close();
    this.inventoryStateService.toggleAsideForAdd();
  }

  /**
  * Get name serivce / produuct
  *  @param item - serivce / produuct
  */
  getNameOrDescription(item) {
    if (item && item.name) return item.name;
    if (item && item.description) return item.description;
    return '';
  }

  /**
   * set and emit product item
   */
  setProduct(productItem) {

    this.elRef.nativeElement.querySelector('#dropdownProducts').value = this.getNameOrDescription(productItem);
    this.products_dropDown.close();
    this.selectedProductItem.next(productItem);
    this.selectedItem = true;
    this.elRef.nativeElement.querySelector("#search-drop-down").value = "";
  }
  togglePanel(data, event) {
    event.target.closest('.card').classList.toggle('opened-card');
    if (!data) {
    }
  }
  onSearch(event) {
    this.search = event.target.value;

    this.resetSearch = false;
  }
  onCloseProducts(open) {
    this.resetSearch = true;
    // this.cd.detectChanges();
  }
  clear() {
    this.elRef.nativeElement.querySelector('#dropdownProducts').value = '';
    this.products_dropDown.close();
    this.selectedProductItem.emit(null);
    //   this.editItem = null;
    this.selectedItem = false;
  }
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
