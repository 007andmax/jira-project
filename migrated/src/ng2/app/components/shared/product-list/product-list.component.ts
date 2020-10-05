import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ElementRef, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { InventoryStateService } from 'src/ng2/app/states/inventory/inventory-state.service';
import { InventoryChange } from '../../inventory/class/inventory-change';
import { Subscription } from 'rxjs';
import { CategoryProductitem } from 'src/ng2/class/category-product-item';

/**
 * Product list component
 */
@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit, OnDestroy {
  @ViewChild('products') products_dropDown: NgbDropdown;
  @Output() selectedProductItem = new EventEmitter<any>();
  itemList: Array<CategoryProductitem> = [];
  @Input() editItem: any;
  @Input() type: string;
  @Input() validate: boolean = true;
  
  classAddProduct: string
  public isFormValid = false;
  isCreateproduct: boolean = false;
  search: string = '';
  resetSearch: boolean = false;
  selectedItem = false;
  sub: Subscription = new Subscription();
  /**
   * Creates an instance of the ProductListComponent with the injected services
   * @param {ElementRef} elRef Service to work with template
   */
  constructor(private elRef: ElementRef,
    public cd: ChangeDetectorRef,
    private inventoryStateService: InventoryStateService) { }


  /**
   * Initializes product list. See [ngOnInit]{@see OnInit#ngOnInit}
   */
  ngOnInit() {
    if (this.type === 'QUOTE') this.classAddProduct = 'quote-add-product';
    if (this.type === 'REPORT') this.classAddProduct = 'report-add-product';
    if (this.type === 'RECURRING-TICKET') this.classAddProduct = 'recurring-ticket-add-product';
    if (this.type === 'TICKET') this.classAddProduct = 'ticket-add-product';
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
    }

 /*   let getChangeProducts = this.inventoryStateService.getChangeProducts().subscribe((data: InventoryChange) => {
      if (data.action === 'PRODUCT_SAVED') {
        const categoryIndex = this.itemList.findIndex((item) => item.id === data.data.category.id);
        if (categoryIndex > -1) {
          let index =  this.itemList[categoryIndex].products.findIndex(item => item.versionedId.id === data.data.versionedId.id)
          if (index > -1) {
            this.itemList[categoryIndex].products[index] = data.data;
          } else {
            this.itemList[categoryIndex].products.push(data.data);
          }
        }
      }
      this.onUpdateList();
      this.cd.detectChanges();
    })
    this.sub.add(getChangeProducts);*/

  }
  public onUpdateList() {
    this.itemList.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
      1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));
    this.itemList.forEach(item => item.products.sort((a, b) => (a.description.toLowerCase() > b.description.toLowerCase()) ?
      1 : ((b.description.toLowerCase() > a.description.toLowerCase()) ? -1 : 0)));

  }


  onCreateProduct() {
    this.products_dropDown.close();
    this.isCreateproduct = true;
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
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
