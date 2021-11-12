import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin, of, Subscription } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ConfirmComponent } from 'src/app/components/shared/confirm/confirm.component';
import { ConfirmStateService } from 'src/app/components/shared/confirm/services/confirm-state.service';
import { DELETE_CRM_JOB_TITLE, DELETE_CRM_JOB_TITLIES } from 'src/app/const/confirm';
import { CrmStateService } from 'src/app/services/crm/crm-state.service';
import { CrmService } from 'src/app/services/crm/crm.service';
import { CrmCompanyIndustryFilter } from '../crm-company-industry/class/crm-company-industry-filter';
import { CrmCompanyJobTitle } from './class/crm-company-job-title';
import { CrmCompanyJobTitleFilter } from './class/crm-company-job-title-filter';

@Component({
  selector: 'crm-company-job-title',
  templateUrl: './crm-company-job-title.component.html',
  styleUrls: ['./crm-company-job-title.component.scss']
})
export class CrmCompanyJobTitleComponent implements OnInit {
  jobTitleList: Array<CrmCompanyJobTitle> = [];
  showAdd: boolean = false;
  filter: CrmCompanyJobTitleFilter = new CrmCompanyJobTitleFilter();
  sub: Subscription = new Subscription();
  constructor(private crmService: CrmService,
    private confirmStateService: ConfirmStateService,
    private crmStateService: CrmStateService,
    public cd: ChangeDetectorRef,
    private modalService: NgbModal) { }

  ngOnInit() {
    this.crmService.getJobTitleList().subscribe((data: any) => {
      console.log("data", data);
      this.jobTitleList = data.map(item => new CrmCompanyJobTitle(item)).sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
        1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));
    })
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
  public toggleShowAdd(data) {
    this.showAdd = data;
  }
  onFilter(field) {
    this.filter.onFilter(field, this.jobTitleList);
  }
  onEditJobTitle(item) {
    if (item.isInitEdit) {
      if (item.length === 0) return;
      this.crmService.editJobTitle(item.id, item.name).subscribe(data => {
        item.onInitEdit(false);
      })
    }
  }
  onRemoveJobTitlies() {
    forkJoin(this.crmStateService.getListJobTitleForRemove().map(item => this.crmService.removeJobTitle(item.id).pipe(map((res) => res),
      catchError(error => of(undefined)))))
      .subscribe(
        () => {
          this.crmStateService.setListJobTitleForRemove([]);
          this.cd.detectChanges();
        },
        error => {
        }
      );
  }
  onRemoveJobTitle(id) {
    this.crmService.removeJobTitle(id).subscribe(data => {

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
    console.log("this.crmStateService.getListJobTitleForRemove().length", this.crmStateService.getListJobTitleForRemove().length);
  }
  removeJobTitle(item) {
    this.confirmStateService.setConfirmAction(DELETE_CRM_JOB_TITLE);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal' });
    modalRef.componentInstance.message = `Do you want to delete job title?`;
    this.crmStateService.setJobTitleForRemove(item);
  }
  ngOnDestroy(): void {
    this.crmStateService.setListJobTitleForRemove([]);
    this.sub.unsubscribe();
  }


}
