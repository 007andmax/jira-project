import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProductType } from '../class/product-type';
import { ProductService } from 'src/app/services/product/product.service';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-add-product-type',
  templateUrl: './add-product-type.component.html',
  styleUrls: ['./add-product-type.component.scss']
})
export class AddProductTypeComponent implements OnInit {
  name: string = "";
  disableCreate: boolean = false;
  isInitRequest: boolean = false;
  @Input() list: Array<ProductType> = [];
  @Output() onClose: EventEmitter<any> = new EventEmitter();
  constructor(private productService: ProductService) { }

  ngOnInit() {
  }
  checkDublicate() {
    var duplicateCategory = this.list.filter((item) => {
      return item.title.toLowerCase() === this.name.toLowerCase();
    });
    if (duplicateCategory && duplicateCategory[0]) {
      return this.disableCreate = true;
    } else {
      return this.disableCreate = false;
    }
  };
  save() {
    if (this.name.length === 0 || this.disableCreate || this.isInitRequest) return;
    this.isInitRequest = true;
    this.productService.addProductType(this.name).pipe(map((res) => res),
      catchError(error => of(undefined)))
      .subscribe(
        () => {
          this.isInitRequest = false;
          this.onClose.emit(null);
        },
        error => {
          this.isInitRequest = false;
        }
      );
  }
  onKeyUp(event) {
    if (event.keyCode === 13) this.save();
  }
}
