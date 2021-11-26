import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin, of, Subscription } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ConfirmComponent } from 'src/app/components/shared/confirm/confirm.component';
import { ConfirmStateService } from 'src/app/components/shared/confirm/services/confirm-state.service';
import { DELETE_CRM_INDUSTRY, DELETE_CRM_INDUSTRIES, DELETE_CRM_JOB_TYPE, DELETE_CRM_JOB_TYPIES } from 'src/app/const/confirm';
import { CrmService } from 'src/app/services/crm/crm.service';
import { CrmRealTimeService } from 'src/app/states/crm/crm-real-time.service';
import { CrmStateService } from 'src/app/states/crm/crm-state.service';
import { CrmCompanyIndustry } from '../crm-company-industry/class/crm-company-industry';
import { CrmCompanyIndustryFilter } from '../crm-company-industry/class/crm-company-industry-filter';
import { CrmCompanyJobType } from './class/crm-company-job-type';
import { CrmCompanyJobTypeFilter } from './class/crm-company-job-type-filter';

@Component({
  selector: 'crm-company-job-type',
  templateUrl: './crm-company-job-type.component.html',
  styleUrls: ['./crm-company-job-type.component.scss']
})
export class CrmCompanyJobTypeComponent implements OnInit {
  jobTypeList: Array<CrmCompanyJobType> = [];
  showAdd: boolean = false;
  filter: CrmCompanyJobTypeFilter = new CrmCompanyJobTypeFilter();
  showPreloader: boolean = true;
  sub: Subscription = new Subscription();
  constructor(private crmService: CrmService,
    private confirmStateService: ConfirmStateService,
    private crmStateService: CrmStateService,
    private crmRealTimeService: CrmRealTimeService,
    public cd: ChangeDetectorRef,
    private modalService: NgbModal) { }

  ngOnInit() {
    if (this.crmStateService.getJobTypeList().length === 0) {
      this.crmStateService.onInitGetJobTypeList();
    } else {
      this.jobTypeList = this.crmStateService.getJobTypeList();
      this.showPreloader = false;
    }
    let onGetJobType = this.crmStateService.onGetJobType.subscribe(data => {
      this.jobTypeList = data;
      this.showPreloader = false;
    })
    this.sub.add(onGetJobType);
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === DELETE_CRM_JOB_TYPE) {
          this.onRemoveJobType(this.crmStateService.getJobTypeForRemove().id);
        }
        if (this.confirmStateService.getConfirmAction() === DELETE_CRM_JOB_TYPIES) {
          this.onRemoveJobTypies();
        }
      }
    })
    this.sub.add(getConfirm);

  }
  public toggleShowAdd(data) {
    this.showAdd = data;
  }
  onFilter(field) {
    this.filter.onFilter(field, this.jobTypeList);
  }
  onEditJobType(item) {
    if (item.isInitEdit) {
      if (item.length === 0 || item.disableUpdate) return;
      this.crmService.editJobType(item.id, item.name).pipe(map((res) => res),
        catchError(error => of(undefined))).subscribe(data => {
          item.onInitEdit(false);
        })
    }
  }
  onRemoveJobTypies() {
    forkJoin(this.crmStateService.getListJobTypeForRemove().map(item => this.crmService.removeJobType(item.id).pipe(map((res) => res),
      catchError(error => of(undefined)))))
      .subscribe(
        () => {
          this.crmStateService.setListJobTypeForRemove([]);
          this.cd.detectChanges();
        },
        error => {
        }
      );
  }
  onRemoveJobType(id) {
    this.crmService.removeJobType(id).subscribe(data => {

    })
  }
  onSelect(event, item) {
    if (event.target.checked) {
      this.crmStateService.getListJobTypeForRemove().push(item);
    } else {
      let list = this.crmStateService.getListJobTypeForRemove();
      let index = list.findIndex(item => item.id === item.id);
      if (index > -1) list.splice(index, 1);
      this.crmStateService.setListJobTypeForRemove(list);
    }
    this.cd.detectChanges();
  }
  remove(item) {
    this.confirmStateService.setConfirmAction(DELETE_CRM_JOB_TYPE);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal' });
    modalRef.componentInstance.message = `Do you want to delete job type?`;
    this.crmStateService.setJobTypeForRemove(item);
  }
  ngOnDestroy(): void {
    this.crmStateService.setListJobTypeForRemove([]);
    this.sub.unsubscribe();
  }
}
