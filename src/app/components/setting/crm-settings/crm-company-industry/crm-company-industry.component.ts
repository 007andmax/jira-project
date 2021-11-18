import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin, of, Subscription } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ConfirmComponent } from 'src/app/components/shared/confirm/confirm.component';
import { ConfirmStateService } from 'src/app/components/shared/confirm/services/confirm-state.service';
import { DELETE_CRM_INDUSTRIES, DELETE_CRM_INDUSTRY } from 'src/app/const/confirm';
import { CrmService } from 'src/app/services/crm/crm.service';
import { CrmRealTimeService } from 'src/app/states/crm/crm-real-time.service';
import { CrmStateService } from 'src/app/states/crm/crm-state.service';
import { CrmCompanyIndustry } from './class/crm-company-industry';
import { CrmCompanyIndustryFilter } from './class/crm-company-industry-filter';

@Component({
  selector: 'crm-company-industry',
  templateUrl: './crm-company-industry.component.html',
  styleUrls: ['./crm-company-industry.component.scss']
})
export class CrmCompanyIndustryComponent implements OnInit, OnDestroy {
  industryList: Array<CrmCompanyIndustry> = [];
  showAdd: boolean = false;
  filter: CrmCompanyIndustryFilter = new CrmCompanyIndustryFilter();
  showPreloader: boolean = true;
  sub: Subscription = new Subscription();
  constructor(private crmService: CrmService,
    private confirmStateService: ConfirmStateService,
    private crmStateService: CrmStateService,
    public cd: ChangeDetectorRef,
    private modalService: NgbModal) { }

  ngOnInit() {
    this.crmService.getIndustryList().subscribe((data: any) => {
      console.log("data", data);
      this.industryList = data.map(item => new CrmCompanyIndustry(item)).sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
        1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));

    })
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === DELETE_CRM_INDUSTRY) {
          this.onRemoveIndustry(this.crmStateService.getIndustryForRemove().id);
        }
        if (this.confirmStateService.getConfirmAction() === DELETE_CRM_INDUSTRIES) {
          this.onRemoveIndustries();
        }
      }
    })
    this.sub.add(getConfirm);
    this.industryList = this.crmStateService.getIndustryList();
    if (this.industryList.length > 0) this.showPreloader = false;
    let onGetIndustry = this.crmStateService.onGetIndustry.subscribe(data => {
      this.industryList = data;
      this.showPreloader = false;
    })
    this.sub.add(onGetIndustry);
  }
  public toggleShowAdd(data) {
    this.showAdd = data;
  }
  onFilter(field) {
    this.filter.onFilter(field, this.industryList);
  }
  onEditIndustry(item) {
    if (item.isInitEdit) {
      if (item.length === 0) return;
      this.crmService.editIndustry(item.id, item.name).subscribe(data => {
        item.onInitEdit(false);
      })
    }
  }
  onRemoveIndustries() {
    forkJoin(this.crmStateService.getListIndustriesForRemove().map(item => this.crmService.removeIndustry(item.id).pipe(map((res) => res),
      catchError(error => of(undefined)))))
      .subscribe(
        () => {
          this.crmStateService.setListIndustriesForRemove([]);
          this.cd.detectChanges();
        },
        error => {
        }
      );
  }
  onRemoveIndustry(id) {
    this.crmService.removeIndustry(id).subscribe(data => {

    })
  }
  onSelect(event, item) {
    if (event.target.checked) {
      this.crmStateService.getListIndustriesForRemove().push(item);
    } else {
      let list = this.crmStateService.getListIndustriesForRemove();
      let index = list.findIndex(item => item.id === item.id);
      if (index > -1) list.splice(index, 1);
      this.crmStateService.setListIndustriesForRemove(list);
    }
    this.cd.detectChanges();
  }
  removeIndustry(item) {
    this.confirmStateService.setConfirmAction(DELETE_CRM_INDUSTRY);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal' });
    modalRef.componentInstance.message = `Do you want to delete industry?`;
    this.crmStateService.setIndustryForRemove(item);
  }
  ngOnDestroy(): void {
    this.crmStateService.setListIndustriesForRemove([]);
    this.sub.unsubscribe();
  }

}
