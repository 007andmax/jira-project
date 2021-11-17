import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommissionService, ICategory } from '../commission.service';
import { ToastrService } from 'ngx-toastr';
import { DELETE_COMMISSION_PRODUCT } from 'src/app/const/confirm';
import { ConfirmComponent } from 'src/app/components/shared/confirm/confirm.component';
import { ConfirmStateService } from 'src/app/components/shared/confirm/services/confirm-state.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit, OnDestroy {
  loading = false;
  categories: any;
  edit = false;
  selectedIdx = -1;
  public confirmPopup = false;
  rate: any;
  id: string;
  category: any;
  factItem = false;
  sub: Subscription = new Subscription();
  constructor(
    private commissionService: CommissionService,
    private toastrService: ToastrService,
    private confirmStateService: ConfirmStateService,
    private modalService: NgbModal
  ) { }


  ngOnInit() {
    this.getCategories();
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      console.log("data", data);
      if (data) {
        if (this.confirmStateService.getConfirmAction() === DELETE_COMMISSION_PRODUCT) {
          this.removeProduct()
        }
      }
    })
    this.sub.add(getConfirm);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
  /**
   * get categories
   */
  getCategories() {
    this.loading = true; $(".loading").css("display", "block");
    this.commissionService.getCategories().subscribe(
      res => {
        this.loading = false; $(".loading").css("display", "none");
        if (res && res.length > 0) {
          this.categories = res;
          for (const cat of this.categories) {
            if (cat && cat.commissionRate !== null) {
              cat.commissionRate = cat.commissionRate.toFixed(2);
            }
          }
        }
      },
      error => {
        this.loading = false; $(".loading").css("display", "none");
      }
    );
  }

  /**
   * set product rate zero
   * @param category
   */
  removeProduct() {
    console.log("removeProduct");
    console.log("this.category", this.category);
    if (this.category && this.category.commissionRate) {
      this.loading = true; $(".loading").css("display", "block");
      this.commissionService
        .setCategoryRate(this.category.id, '0', false)
        .subscribe(
          res => {
            this.toastrService.success('Removed Successfully')
            this.selectedIdx = -1;
            this.loading = false; $(".loading").css("display", "none");
            this.category.commissionRate = null;
          },
          error => {
            this.toastrService.error('Bad Request')
            this.loading = false; $(".loading").css("display", "none");
          }
        );
    }
  }

  editProduct(i: number) {
    this.selectedIdx = i;
  }

  /**
   * set category rate
   * @param rate
   * @param id
   * @param category
   */
  setCategoryRate() {
    let data = {
      rate: '',
      setForOldExpenses: false
    };

    if (this.rate || this.rate === 0) {
      data = {
        rate: this.rate,
        setForOldExpenses: false
      };

      if (this.category.commissionRate === null) {
        if (this.factItem === true) {
          data.setForOldExpenses = true;
        }
      }
      this.loading = true; $(".loading").css("display", "block");
      this.commissionService
        .setCategoryRate(this.id, data.rate, data.setForOldExpenses)
        .subscribe(
          (res: any) => {
            this.toastrService.success(`Commission Rate Changed Successfully`);
            this.loading = false; $(".loading").css("display", "none");
            this.category.commissionRate = res.commissionRate.toFixed(2);
            this.selectedIdx = -1;
            this.factItem = false;
            this.confirmPopup = false;
          },
          error => {
            this.selectedIdx = -1;
            this.loading = false; $(".loading").css("display", "none");
            this.toastrService.error('Bad Request');
            this.factItem = false;
            this.confirmPopup = false;
          }
        );
    } else {
      this.selectedIdx = -1;
    }
  }

  confirmDelete(data: any) {
    this.category = data;
    this.confirmStateService.setConfirmAction(DELETE_COMMISSION_PRODUCT);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal' });
    modalRef.componentInstance.message = `Are you sure you want ${this.category.name} commission rate to zero?`;
  }

  confirmEdit(rate, id: string, category: any) {
    this.rate = rate;
    this.id = id;
    this.category = category;
    if (this.category.commissionRate === null) {
      this.confirmPopup = true;
    } else {
      this.confirmPopup = false;
      this.factItem = false;
      this.setCategoryRate();
    }

  }
}
