import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ConfirmComponent } from 'src/app/components/shared/confirm/confirm.component';
import { ConfirmStateService } from 'src/app/components/shared/confirm/services/confirm-state.service';
import { DELETE_COMMISSION_PRODUCT, CHANGE_COMMISSION_PRODUCT } from 'src/app/const/confirm';
import { CommissionService } from 'src/app/services/commission/commission.service';
import { ProductsCategoryFilter } from '../../products-settings/class/products-category-filter';
import { ApiKeysService } from 'src/app/services/api-keys/api-keys.service';
import { ApiKeys } from './class/api-keys';

@Component({
  selector: 'app-company-profile-api-keys',
  templateUrl: './company-profile-api-keys.component.html',
  styleUrls: ['./company-profile-api-keys.component.scss']
})
export class CompanyProfileApiKeysComponent implements OnInit {

  filter: ProductsCategoryFilter = new ProductsCategoryFilter();
  loading = true;
  list: Array<ApiKeys> = [];
  edit = false;
  selectedIdx = -1;
  rate: any;
  id: string;
  category: any;
  factItem = false;
  sub: Subscription = new Subscription();
  constructor(
    private apiKeysService: ApiKeysService,
    private toastrService: ToastrService,
    private confirmStateService: ConfirmStateService,
    private modalService: NgbModal
  ) { }


  ngOnInit() {
    this.getList();
    /* let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
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
     this.sub.add(getConfirm);*/
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  onFilter(field) {
    //this.filter.onFilter(field, this.categories);
  }

  /**
   * get categories
   */
  getList() {
    this.apiKeysService.getKyes().subscribe(
      (res: any) => {
        this.list = res.map(item => new ApiKeys(item));
        this.loading = false;
      },
      error => {
        this.loading = false;
      }
    );
  }



  confirmDelete(data: any) {
    this.category = data;
    this.confirmStateService.setConfirmAction(DELETE_COMMISSION_PRODUCT);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.message = `Are you sure you want ${this.category.name} commission rate to zero?`;
  }
  public trackById(index, item) {
    return item.id;
  }
}
