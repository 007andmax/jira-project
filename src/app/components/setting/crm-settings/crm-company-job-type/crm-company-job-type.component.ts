import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin, of, Subscription } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ConfirmComponent } from 'src/app/components/shared/confirm/confirm.component';
import { ConfirmStateService } from 'src/app/components/shared/confirm/services/confirm-state.service';
import { DELETE_CRM_JOB_TYPE, DELETE_CRM_JOB_TYPIES } from 'src/app/const/confirm';
import { CrmService } from 'src/app/services/crm/crm.service';
import { CrmRealTimeService } from 'src/app/states/crm/crm-real-time.service';
import { CrmStateService } from 'src/app/states/crm/crm-state.service';
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
    public cd: ChangeDetectorRef,
    private modalService: NgbModal) { }

  ngOnInit() {
    if (this.crmStateService.getJobTypeList().length === 0) {
      this.crmStateService.onInitGetJobTypeList();
    } else {
      this.jobTypeList = JSON.parse(JSON.stringify(this.crmStateService.getJobTypeList())).map(item => new CrmCompanyJobType(item));
      this.showPreloader = false;
    }
    let onGetJobType = this.crmStateService.onGetJobType.subscribe(data => {
      this.jobTypeList = JSON.parse(JSON.stringify(data)).map(item => new CrmCompanyJobType(item)).sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
        1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));
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
  onSelectAll(event) {
    if (event.target.checked) {
      this.jobTypeList.forEach(item => {
        item.selected = true;
        this.crmStateService.getListJobTypeForRemove().push(item);
      })
    } else {
      this.jobTypeList.forEach(item => (item.selected = false));
      this.crmStateService.setListJobTypeForRemove([]);
    }
    this.cd.detectChanges();
  }
  public toggleShowAdd(data) {
    this.showAdd = data;
  }
  onFilter(field) {
    this.filter.onFilter(field, this.jobTypeList);
  }
  onEditJobType(item, event) {
    if (item.isInitEdit) {
      if (item.length === 0 || item.disableUpdate || item.isInitRequest) return;
      item.setIsInitRequest(true);
      this.crmService.editJobType(item.id, item.name).pipe(map((res) => res),
        catchError(error => of(undefined))).subscribe(data => {
          item.setIsInitRequest(false);
          item.onInitEdit(false);
          if (event) event.target.blur();
        }, err => {
          item.setIsInitRequest(false);
        })
    }
  }
  onRemoveJobTypies() {
    forkJoin(this.crmStateService.getListJobTypeForRemove().map(item => this.crmService.removeJobType(item.id).pipe(map((res) => res),
      catchError(error => of(undefined)))))
      .subscribe(
        () => {
          this.confirmStateService.initRequest(false);
          this.crmStateService.setListJobTypeForRemove([]);
          this.cd.detectChanges();
        },
        error => {
          this.confirmStateService.initRequest(false);
        }
      );
  }
  onRemoveJobType(id) {
    this.crmService.removeJobType(id).subscribe(data => {
      this.confirmStateService.initRequest(false);
      this.crmStateService.setListJobTypeForRemove([]);
      this.cd.detectChanges();
    }, err => {
      this.confirmStateService.initRequest(false);
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
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.header = `Delete Job Type`;
    modalRef.componentInstance.message = `Are you sure you want to delete this job type?`;
    this.crmStateService.setJobTypeForRemove(item);
  }
  ngOnDestroy(): void {
    this.crmStateService.setListJobTypeForRemove([]);
    this.sub.unsubscribe();
  }
}
