import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin, of, Subscription } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ConfirmComponent } from 'src/app/components/shared/confirm/confirm.component';
import { ConfirmStateService } from 'src/app/components/shared/confirm/services/confirm-state.service';
import { DELETE_CRM_JOB_TITLE, DELETE_CRM_JOB_TITLIES } from 'src/app/const/confirm';
import { CrmService } from 'src/app/services/crm/crm.service';
import { CrmRealTimeService } from 'src/app/states/crm/crm-real-time.service';
import { CrmStateService } from 'src/app/states/crm/crm-state.service';
import { CrmCompanyJobTitle } from './class/crm-company-job-title';
import { CrmCompanyJobTitleFilter } from './class/crm-company-job-title-filter';
import { TicketSortBy } from 'src/app/components/tickets/tickets/class/ticket-sort-by';

@Component({
  selector: 'crm-company-job-title',
  templateUrl: './crm-company-job-title.component.html',
  styleUrls: ['./crm-company-job-title.component.scss']
})
export class CrmCompanyJobTitleComponent implements OnInit {
  jobTitleList: Array<CrmCompanyJobTitle> = [];
  showAdd: boolean = false;
  filter: CrmCompanyJobTitleFilter = new CrmCompanyJobTitleFilter();
  showPreloader: boolean = true;
  sub: Subscription = new Subscription();
  sortBy: TicketSortBy = new TicketSortBy('name', 'ASC');
  constructor(private crmService: CrmService,
    private confirmStateService: ConfirmStateService,
    private crmStateService: CrmStateService,
    public cd: ChangeDetectorRef,
    private modalService: NgbModal) { }

  ngOnInit() {
    this.jobTitleList = JSON.parse(JSON.stringify(this.crmStateService.getJobTitleList())).map(item => new CrmCompanyJobTitle(item));
    if (this.crmStateService.isInitGetJobTitle) this.showPreloader = false;
    let onGetJobTitle = this.crmStateService.onGetJobTitle.subscribe(data => {
      this.jobTitleList = JSON.parse(JSON.stringify(data)).map(item => new CrmCompanyJobTitle(item)).sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
        1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));;
      this.showPreloader = false;
    })
    this.sub.add(onGetJobTitle);
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === DELETE_CRM_JOB_TITLE) {
          this.onRemoveJobTitle(this.crmStateService.getJobTitleForRemove().id);
        }
        if (this.confirmStateService.getConfirmAction() === DELETE_CRM_JOB_TITLIES) {
          this.onRemoveJobTitlies();
        }
      }
    })
    this.sub.add(getConfirm);

  }
  onSelectAll(event) {
    if (event.target.checked) {
      this.jobTitleList.forEach(item => {
        item.selected = true;
        this.crmStateService.getListJobTitleForRemove().push(item);
      })
    } else {
      this.jobTitleList.forEach(item => (item.selected = false));
      this.crmStateService.setListJobTitleForRemove([]);
    }
    this.cd.detectChanges();
  }
  public toggleShowAdd(data) {
    this.showAdd = data;
  }
  onFilter(field) {
    this.sortBy.sortBy = field;
    this.filter.onFilter(field, this.jobTitleList);
    this.sortBy.sortDirection = this.filter.direction;
  }
  onEditJobTitle(item, event) {
    if (item.isInitEdit) {
      if (item.length === 0 || item.disableUpdate || item.isInitRequest) return;
      item.setIsInitRequest(true);
      this.crmService.editJobTitle(item.id, item.name).pipe(map((res) => res),
        catchError(error => of(undefined))).subscribe(data => {
          item.setIsInitRequest(false);
          item.onInitEdit(false);
          if (event) event.target.blur();
        }, err => {
          item.setIsInitRequest(false);
        })
    }
  }
  onRemoveJobTitlies() {
    forkJoin(this.crmStateService.getListJobTitleForRemove().map(item => this.crmService.removeJobTitle(item.id).pipe(map((res) => res),
      catchError(error => of(undefined)))))
      .subscribe(
        () => {
          this.confirmStateService.initRequest(false);
          this.crmStateService.setListJobTitleForRemove([]);
          this.cd.detectChanges();
        },
        error => {
          this.confirmStateService.initRequest(false);
        }
      );
  }
  onRemoveJobTitle(id) {
    this.crmService.removeJobTitle(id).subscribe(data => {
      this.confirmStateService.initRequest(false);
      this.crmStateService.setListJobTitleForRemove([]);
      this.cd.detectChanges();
    }, err => {
      this.confirmStateService.initRequest(false);
    })
  }
  onSelect(event, item) {
    if (event.target.checked) {
      this.crmStateService.getListJobTitleForRemove().push(item);
    } else {
      let list = this.crmStateService.getListJobTitleForRemove();
      let index = list.findIndex(item => item.id === item.id);
      if (index > -1) list.splice(index, 1);
      this.crmStateService.setListJobTitleForRemove(list);
    }
    this.cd.detectChanges();
  }
  removeJobTitle(item) {
    this.confirmStateService.setConfirmAction(DELETE_CRM_JOB_TITLE);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.header = `Delete Job Title`;
    modalRef.componentInstance.message = `Are you sure you want to delete this job title?`;
    this.crmStateService.setJobTitleForRemove(item);
  }
  ngOnDestroy(): void {
    this.crmStateService.setListJobTitleForRemove([]);
    this.sub.unsubscribe();
  }


}
