import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommissionService, ICategory } from '../../../../services/commission/commission.service';
import { ToastrService } from 'ngx-toastr';
import { CHANGE_COMMISSION_PRODUCT, DELETE_COMMISSION_PRODUCT } from 'src/app/const/confirm';
import { ConfirmComponent } from 'src/app/components/shared/confirm/confirm.component';
import { ConfirmStateService } from 'src/app/components/shared/confirm/services/confirm-state.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { ProductsCategoryFilter } from '../../products-settings/class/products-category-filter';
import { TicketSortBy } from 'src/app/components/tickets/tickets/class/ticket-sort-by';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit, OnDestroy {
  filter: ProductsCategoryFilter = new ProductsCategoryFilter();
  loading = true;
  categories: any;
  edit = false;
  selectedIdx = -1;
  rate: any;
  id: string;
  category: any;
  factItem = false;
  sub: Subscription = new Subscription();
  sortBy: TicketSortBy = new TicketSortBy('name', 'ASC');
  constructor(
    private commissionService: CommissionService,
    private toastrService: ToastrService,
    private confirmStateService: ConfirmStateService,
    private modalService: NgbModal
  ) { }


  ngOnInit() {
    this.getCategories();
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data != null) {
        if (this.confirmStateService.getConfirmAction() === DELETE_COMMISSION_PRODUCT) {
          if (data) this.removeProduct()
        }
        if (this.confirmStateService.getConfirmAction() === CHANGE_COMMISSION_PRODUCT) {
          if (data) {
            this.factItem = true; this.setCategoryRate();
          }
          if (!data) {
            this.factItem = false; this.setCategoryRate();
          }
        }
      }
    })
    this.sub.add(getConfirm);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  onFilter(field) {
    this.sortBy.sortBy = field;
    this.filter.onFilter(field, this.categories);
    this.sortBy.sortDirection = this.filter.direction;
  }

  /**
   * get categories
   */
  getCategories() {
    this.commissionService.getCategories().subscribe(
      res => {
        this.loading = false;
        if (res && res.length > 0) {
          this.categories = res.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
            1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));
          for (const cat of this.categories) {
            if (cat && cat.commissionRate !== null) {
              cat.commissionRate = cat.commissionRate.toFixed(2);
            }
          }
        }
      },
      error => {
        this.loading = false;
      }
    );
  }

  /**
   * set product rate zero
   * @param category
   */
  removeProduct() {
    if (this.category && this.category.commissionRate) {
      this.commissionService
        .setCategoryRate(this.category.id, '0', false)
        .subscribe(
          res => {
            this.confirmStateService.initRequest(false);
            this.selectedIdx = -1;
            this.category.commissionRate = null;
          },
          error => {
            this.confirmStateService.initRequest(false);
            this.toastrService.error('Bad Request')
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
      this.commissionService
        .setCategoryRate(this.id, data.rate, data.setForOldExpenses)
        .subscribe(
          (res: any) => {
            this.confirmStateService.initRequest(false);
            this.category.commissionRate = res.commissionRate.toFixed(2);
            this.selectedIdx = -1;
            this.factItem = false;
          },
          error => {
            this.confirmStateService.initRequest(false);
            this.selectedIdx = -1;
            this.toastrService.error('Bad Request');
            this.factItem = false;
          }
        );
    } else {
      this.selectedIdx = -1;
    }
  }

  confirmDelete(data: any) {
    this.category = data;
    this.confirmStateService.setConfirmAction(DELETE_COMMISSION_PRODUCT);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.header = `Reset rate`;
    modalRef.componentInstance.message = `Are you sure you want to set the commission rate for ${this.category.name} commission rate to zero?`;
  }

  confirmEdit(rate, id: string, category: any) {
    this.rate = rate;
    this.id = id;
    this.category = category;
    if (this.category.commissionRate === null) {
      this.confirmStateService.setConfirmAction(CHANGE_COMMISSION_PRODUCT);
      const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
      modalRef.componentInstance.header = `Apply Commission`;
      modalRef.componentInstance.message = `Are you sure you want the commission rate to be applied to old items?`;
    } else {
      this.factItem = false;
      this.setCategoryRate();
    }

  }
}
