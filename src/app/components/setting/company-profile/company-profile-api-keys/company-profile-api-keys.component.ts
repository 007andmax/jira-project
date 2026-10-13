import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ConfirmComponent } from 'src/app/components/shared/confirm/confirm.component';
import { ConfirmStateService } from 'src/app/components/shared/confirm/services/confirm-state.service';
import { DELETE_COMMISSION_PRODUCT, CHANGE_COMMISSION_PRODUCT, DELETE_API_KEY } from 'src/app/const/confirm';
import { CommissionService } from 'src/app/services/commission/commission.service';
import { ProductsCategoryFilter } from '../../products-settings/class/products-category-filter';
import { ApiKeysService } from 'src/app/services/api-keys/api-keys.service';
import { ApiKeys } from './class/api-keys';
import { ApiKeysStateService } from 'src/app/states/api-keys/api-keys-state.service';
import { CompanyProfileApiKeysFilter } from './class/company-profile-api-keys-filter';
import { ApiKeysRealTimeService } from 'src/app/states/api-keys/api-keys-real-time.service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-company-profile-api-keys',
  templateUrl: './company-profile-api-keys.component.html',
  styleUrls: ['./company-profile-api-keys.component.scss']
})
export class CompanyProfileApiKeysComponent implements OnInit {

  filter: CompanyProfileApiKeysFilter = new CompanyProfileApiKeysFilter();
  loading = true;
  list: Array<ApiKeys> = [];
  sub: Subscription = new Subscription();
  constructor(
    private apiKeysService: ApiKeysService,
    private toastrService: ToastrService,
    private confirmStateService: ConfirmStateService,
    private modalService: NgbModal,
    private apiKeysStateService: ApiKeysStateService,
    private apiKeysRealTimeService: ApiKeysRealTimeService
  ) { }


  ngOnInit() {
    this.getList();
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data != null) {
        if (this.confirmStateService.getConfirmAction() === DELETE_API_KEY) {
          if (data) this.removeApiKey(this.apiKeysStateService.getApiKeyForRemove().id);
        }
      }
    })
    this.sub.add(getConfirm);
    let onFastAdd = this.apiKeysStateService.onFastAdd.subscribe(data => {
      this.updateAPiKey(data);
    })
    this.sub.add(onFastAdd);
    let onFastEdit = this.apiKeysStateService.onFastEdit.subscribe(data => {
      this.updateAPiKey(data);
    })
    this.sub.add(onFastEdit);
    let changeApiKeysArray = this.apiKeysRealTimeService.changeApiKeysArray.subscribe(newChange => {
      if (newChange.action === 'API_KEY_SAVED') {
        const Index = this.list.findIndex((item) => item.id === newChange.data.id);
        if (Index > -1) this.list[Index] = new ApiKeys(newChange.data);
        if (Index === -1) {
          this.list.push(new ApiKeys(newChange.data));
          this.filter.onFilterByField('title', this.list);
        }
      }

      if (newChange.action === 'API_KEY_REMOVED') {
        const Index = this.list.findIndex((item) => item.id === newChange.data);
        if (Index > -1) this.list.splice(Index, 1);
      }
    })
    this.sub.add(changeApiKeysArray);
  }
  removeApiKey(id) {
    this.apiKeysService.remove(id).subscribe(
      (res: any) => {
        this.confirmStateService.initRequest(false);
        const Index = this.list.findIndex((item) => item.id === id);
        if (Index > -1) this.list.splice(Index, 1);
      }, err => {
        this.confirmStateService.initRequest(false);
      });
  }
  updateAPiKey(data) {
    let findIndex = this.list.findIndex(item => item.id === data.id);
    if (findIndex > -1) {
      this.list[findIndex] = new ApiKeys(data);
    } else {
      this.list.push(new ApiKeys(data));
      this.filter.onFilterByField('title', this.list);
    }
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  onFilter(field) {
    this.filter.onFilter(field, this.list);
  }

  /**
   * get categories
   */
  getList() {
    this.apiKeysService.getKyes().subscribe(
      (res: any) => {
        this.list = res.map(item => new ApiKeys(item));
        this.list.sort((a, b) => (a.title.toLowerCase() > b.title.toLowerCase()) ?
          1 : ((b.title.toLowerCase() > a.title.toLowerCase()) ? -1 : 0));
        this.loading = false;
      },
      error => {
        this.loading = false;
      }
    );
  }
  editApiKey(item) {
    this.apiKeysStateService.openEditAside(item);
  }


  confirmDelete(data: any) {
    this.apiKeysStateService.setApiKeyForRemove(data);
    this.confirmStateService.setConfirmAction(DELETE_API_KEY);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.header = `Delete API Key`;
    modalRef.componentInstance.message = `Are you sure you want to delete this API key?`;
  }
  public trackById(index, item) {
    return item.id;
  }
}
