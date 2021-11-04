import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { CategoryProduct } from 'src/app/interfaces/product/category-product';
import { ProductService } from '../../product/product.service';

@Component({
  selector: 'modal-edit-category-product',
  templateUrl: './modal-edit-category-product.component.html',
  styleUrls: ['./modal-edit-category-product.component.scss'],
  providers: [NgbModalConfig, NgbModal]
})
export class ModalEditCategoryProductComponent implements OnInit {
  @Input() categoryProduct: CategoryProduct;
  constructor(public activeModal: NgbActiveModal,
    private productService: ProductService) { }

  ngOnInit() {
  }
  public close() {

    this.activeModal.dismiss('Cross click');
  }
  public save() {
    this.productService.editCategory(this.categoryProduct.id, this.categoryProduct.name).subscribe(data => {
      this.close();
    })
  }
}
