import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';

/**
 * Product list component
 */
@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  @ViewChild('products') products_dropDown: NgbDropdown;
  @Output() selectedProductItem = new EventEmitter<any>();
  @Input() itemList: any;
  @Input() editItem: any;
  public isFormValid = false;
  search:string = '';
  resetSearch:boolean = false;
  /**
   * Creates an instance of the ProductListComponent with the injected services
   * @param {ElementRef} elRef Service to work with template
   */
  constructor(private elRef: ElementRef,  public cd: ChangeDetectorRef,) { }

  /**
   * Initializes product list. See [ngOnInit]{@see OnInit#ngOnInit}
   */
  ngOnInit() {
    this.itemList.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
      1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));
    this.itemList.forEach(item => item.products.sort((a, b) => (a.description.toLowerCase() > b.description.toLowerCase()) ?
      1 : ((b.description.toLowerCase() > a.description.toLowerCase()) ? -1 : 0)));
      if (this.editItem) this.elRef.nativeElement.querySelector('#dropdownProducts').value = this.getNameOrDescription(this.editItem);

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
  }

  onSearch (event) {
    this.search = event.target.value;
   
    this.resetSearch = false;
  }
  onCloseProducts(open) {
    this.resetSearch = true;
   // this.cd.detectChanges();
  }
  

}
