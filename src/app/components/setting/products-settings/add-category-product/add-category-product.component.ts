import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { of, Subscription } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CategoryProduct } from 'src/app/interfaces/product/category-product';
import { ProductService } from 'src/app/services/product/product.service';
import { GlNumberStateService } from 'src/app/states/gl-number/gl-number-state.service';
import { InventoryStateService } from 'src/app/states/inventory/inventory-state.service';
import { GlNumber } from 'src/class/gl-number/gl-number';

@Component({
  selector: 'add-category-product',
  templateUrl: './add-category-product.component.html',
  styleUrls: ['./add-category-product.component.scss']
})
export class AddCategoryProductComponent implements OnInit {
  isInitRequest: boolean = false;
  @Output() onClose: EventEmitter<any> = new EventEmitter();
  name: string = "";
  glNumber: GlNumber;
  glNumbers: Array<GlNumber> = [];
  categories: Array<CategoryProduct> = [];
  disableCreateCategory: boolean = false;
  sub: Subscription = new Subscription();
  constructor(private productService: ProductService,
    private glNumberStateService: GlNumberStateService,
    private inventoryStateService: InventoryStateService,) { }

  ngOnInit() {
    if (this.inventoryStateService.getCategories().length > 0) this.categories = this.inventoryStateService.getCategories();
    let getOnCategries = this.inventoryStateService.getOnCategries().subscribe((data) => {
      this.categories = data;

    })
    this.sub.add(getOnCategries);
    if (this.glNumberStateService.getGLNumbers().length > 0) this.glNumbers = this.sortGlNumbers(this.glNumberStateService.getGLNumbers());
    let getOnGlNumbers = this.glNumberStateService.getOnGlNumbers().subscribe((data) => {
      this.glNumbers = this.sortGlNumbers(data);
    })
    this.sub.add(getOnGlNumbers);
  }
  private sortGlNumbers(data) {
    return data.sort((a, b) => (a.glNumber.toLowerCase() > b.glNumber.toLowerCase()) ?
      1 : ((b.glNumber.toLowerCase() > a.glNumber.toLowerCase()) ? -1 : 0));
  }
  checkDublicateCategory() {
    var duplicateCategory = this.categories.filter((item) => {
      return item.name.toLowerCase() === this.name.toLowerCase();
    });
    if (duplicateCategory && duplicateCategory[0]) {
      return this.disableCreateCategory = true;
    } else {
      return this.disableCreateCategory = false;
    }
  };
  public save() {
    if (this.name.length === 0 || this.disableCreateCategory || this.isInitRequest) return;
    this.isInitRequest = true;
    this.productService.addCategory(this.name, (this.glNumber) ? { id: this.glNumber.id } : null).pipe(map((res) => res),
      catchError(error => of(undefined))).subscribe(data => {
        this.isInitRequest = false;
        this.close();
      }, err => {
        this.isInitRequest = false;
      })

  }
  onKeyUp(event) {
    if (event.keyCode === 13) this.save();
  }
  glDropDownItemName(item) {
    return `${item["glNumber"]} - ${(item["description"] && item["description"].length > 0) ? item["description"]
      : "No description"}`;
  }
  onSelectGlNumbers(item) {
    this.glNumber = item;
  }
  public close() {
    this.onClose.emit(null);
  }
}
