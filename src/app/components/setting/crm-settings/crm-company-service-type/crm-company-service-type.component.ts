import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin, of, Subscription } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ConfirmComponent } from 'src/app/components/shared/confirm/confirm.component';
import { ConfirmStateService } from 'src/app/components/shared/confirm/services/confirm-state.service';
import { DELETE_CRM_SERVICE_TYPE, DELETE_CRM_SERVICE_TYPIES } from 'src/app/const/confirm';
import { CrmService } from 'src/app/services/crm/crm.service';
import { CrmRealTimeService } from 'src/app/states/crm/crm-real-time.service';
import { CrmStateService } from 'src/app/states/crm/crm-state.service';
import { CrmCompanyServiceType } from './class/crm-company-service-type';
import { CrmCompanyServiceTypeFilter } from './class/crm-company-service-type-filter';

@Component({
  selector: 'crm-company-service-type',
  templateUrl: './crm-company-service-type.component.html',
  styleUrls: ['./crm-company-service-type.component.scss']
})
export class CrmCompanyServiceTypeComponent implements OnInit, OnDestroy {

  serviceTypeList: Array<CrmCompanyServiceType> = [];
  showAdd: boolean = false;
  filter: CrmCompanyServiceTypeFilter = new CrmCompanyServiceTypeFilter();
  showPreloader: boolean = true;
  sub: Subscription = new Subscription();
  constructor(private crmService: CrmService,
    private confirmStateService: ConfirmStateService,
    private crmStateService: CrmStateService,
    public cd: ChangeDetectorRef,
    private modalService: NgbModal) { }

  ngOnInit() {
    if (this.crmStateService.getServiceTypeList().length === 0) {
      this.crmStateService.onInitGetServiceTypeList();
    } else {
      this.serviceTypeList = this.crmStateService.getServiceTypeList();
      this.showPreloader = false;
    }
    let onGetServiceType = this.crmStateService.onGetServiceType.subscribe(data => {
      this.serviceTypeList = data.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
        1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));;
      this.showPreloader = false;
    })
    this.sub.add(onGetServiceType);
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === DELETE_CRM_SERVICE_TYPE) {
          this.removeServiceType(this.crmStateService.getServiceTypeForRemove().id);
        }
        if (this.confirmStateService.getConfirmAction() === DELETE_CRM_SERVICE_TYPIES) {
          this.onRemoveServiceTypies();
        }
      }
    })
    this.sub.add(getConfirm);
  }
  public toggleShowAdd(data) {
    this.showAdd = data;
  }
  onFilter(field) {
    this.filter.onFilter(field, this.serviceTypeList);
  }
  onEditServiceType(item, event) {
    if (item.isInitEdit) {
      if (item.length === 0 || item.disableUpdate || item.isInitRequest) return;
      item.setIsInitRequest(true);
      this.crmService.editServiceType(item.id, item.name).pipe(map((res) => res),
        catchError(error => of(undefined))).subscribe(data => {
          item.setIsInitRequest(false);
          item.onInitEdit(false);
          if (event) event.target.blur();
        }, err => {
          item.setIsInitRequest(false);
        })
    }
  }
  onSelectAll(event) {
    if (event.target.checked) {
      this.serviceTypeList.forEach(item => {
        item.selected = true;
        this.crmStateService.getListServiceTypeForRemove().push(item);
      })
    } else {
      this.serviceTypeList.forEach(item => (item.selected = false));
      this.crmStateService.setListServiceTypeForRemove([]);
    }
    this.cd.detectChanges();
  }
  onRemoveServiceTypies() {
    forkJoin(this.crmStateService.getListServiceTypeForRemove().map(item => this.crmService.removeServiceType(item.id).pipe(map((res) => res),
      catchError(error => of(undefined)))))
      .subscribe(
        () => {
          this.confirmStateService.initRequest(false);
          this.crmStateService.setListServiceTypeForRemove([]);
          this.cd.detectChanges();
        },
        error => {
          this.confirmStateService.initRequest(false);
        }
      );
  }
  removeServiceType(id) {
    this.crmService.removeServiceType(id).subscribe(data => {
      this.confirmStateService.initRequest(false);
      this.crmStateService.setListServiceTypeForRemove([]);
      this.cd.detectChanges();
    }, err => {
      this.confirmStateService.initRequest(false);
    })
  }
  onSelect(event, item) {
    if (event.target.checked) {
      this.crmStateService.getListServiceTypeForRemove().push(item);
    } else {
      let list = this.crmStateService.getListServiceTypeForRemove();
      let index = list.findIndex(item => item.id === item.id);
      if (index > -1) list.splice(index, 1);
      this.crmStateService.setListServiceTypeForRemove(list);
    }
    this.cd.detectChanges();
  }
  remove(item) {
    this.confirmStateService.setConfirmAction(DELETE_CRM_SERVICE_TYPE);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.header = `Delete Service Type`;
    modalRef.componentInstance.message = `Are you sure you want to delete this service type?`;
    this.crmStateService.setServiceTypeForRemove(item);
  }
  ngOnDestroy(): void {
    this.crmStateService.setListIndustriesForRemove([]);
    this.sub.unsubscribe();
  }

}
