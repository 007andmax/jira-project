import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin, of, Subscription } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ConfirmComponent } from 'src/app/components/shared/confirm/confirm.component';
import { ConfirmStateService } from 'src/app/components/shared/confirm/services/confirm-state.service';
import { DELETE_CRM_INDUSTRY, DELETE_CRM_INDUSTRIES, DELETE_CRM_SERVICE_TYPE, DELETE_CRM_SERVICE_TYPIES } from 'src/app/const/confirm';
import { CrmStateService } from 'src/app/services/crm/crm-state.service';
import { CrmService } from 'src/app/services/crm/crm.service';
import { CrmRealTimeService } from 'src/app/states/crm/crm-real-time.service';
import { CrmCompanyIndustry } from '../crm-company-industry/class/crm-company-industry';
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
    private crmRealTimeService: CrmRealTimeService,
    public cd: ChangeDetectorRef,
    private modalService: NgbModal) { }

  ngOnInit() {
    this.crmService.getServiceTypeList().subscribe((data: any) => {
      console.log("data", data);
      this.serviceTypeList = data.map(item => new CrmCompanyServiceType(item)).sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
        1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));
      this.showPreloader = false;
    })
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
    let changeCrmArray = this.crmRealTimeService.changeCrmArray.subscribe(data => {
      if (data.action === "SERVICE_TYPE_SAVED") this.serviceTypeList.push(new CrmCompanyServiceType(data.data));
      if (data.action === "SERVICE_TYPE_EDITED") {
        let index = this.serviceTypeList.findIndex(item => item.id === data.data);
        if (index > -1) this.serviceTypeList[index].onUpdate(data.data);
      }
      if (data.action === "SERVICE_TYPE_REMOVED") {
        let index = this.serviceTypeList.findIndex(item => item.id === data.data);
        if (index > -1) this.serviceTypeList.splice(index, 1);
      }
      this.cd.detectChanges();
    })
    this.sub.add(changeCrmArray);
  }
  public toggleShowAdd(data) {
    this.showAdd = data;
  }
  onFilter(field) {
    this.filter.onFilter(field, this.serviceTypeList);
  }
  onEditServiceType(item) {
    if (item.isInitEdit) {
      if (item.length === 0) return;
      this.crmService.editServiceType(item.id, item.name).subscribe(data => {
        item.onInitEdit(false);
      })
    }
  }
  onRemoveServiceTypies() {
    forkJoin(this.crmStateService.getListServiceTypeForRemove().map(item => this.crmService.removeServiceType(item.id).pipe(map((res) => res),
      catchError(error => of(undefined)))))
      .subscribe(
        () => {
          this.crmStateService.setListServiceTypeForRemove([]);
          this.cd.detectChanges();
        },
        error => {
        }
      );
  }
  removeServiceType(id) {
    this.crmService.removeServiceType(id).subscribe(data => {

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
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal' });
    modalRef.componentInstance.message = `Do you want to delete service type?`;
    this.crmStateService.setServiceTypeForRemove(item);
  }
  ngOnDestroy(): void {
    this.crmStateService.setListIndustriesForRemove([]);
    this.sub.unsubscribe();
  }

}
