import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin, of, Subscription } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ConfirmComponent } from 'src/app/components/shared/confirm/confirm.component';
import { ConfirmStateService } from 'src/app/components/shared/confirm/services/confirm-state.service';
import { DELETE_CRM_INDUSTRIES, DELETE_CRM_INDUSTRY } from 'src/app/const/confirm';
import { CrmService } from 'src/app/services/crm/crm.service';
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
    this.industryList = JSON.parse(JSON.stringify(this.crmStateService.getIndustryList())).map(item => new CrmCompanyIndustry(item)).sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
      1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));
    if (this.crmStateService.isInitGetIndustry) this.showPreloader = false;
    let onGetIndustry = this.crmStateService.onGetIndustry.subscribe(data => {
      this.industryList = JSON.parse(JSON.stringify(data)).map(item => new CrmCompanyIndustry(item)).sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
        1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));
      this.showPreloader = false;
      this.cd.detectChanges();
    })
    this.sub.add(onGetIndustry);
  }
  public toggleShowAdd(data) {
    this.showAdd = data;
  }
  onFilter(field) {
    this.filter.onFilter(field, this.industryList);
  }
  onSelectAll(event) {
    if (event.target.checked) {
      this.industryList.forEach(item => {
        item.selected = true;
        this.crmStateService.getListIndustriesForRemove().push(item);
      })
    } else {
      this.industryList.forEach(item => (item.selected = false));
      this.crmStateService.setListIndustriesForRemove([]);
    }
    this.cd.detectChanges();
  }
  onEditIndustry(item, event) {
    if (item.isInitEdit) {
      if (item.length === 0 || item.disableUpdate || item.isInitRequest) return;
      item.setIsInitRequest(true);
      this.crmService.editIndustry(item.id, item.name).pipe(map((res) => res),
        catchError(error => of(undefined)))
        .subscribe(data => {
          item.setIsInitRequest(false);
          item.onInitEdit(false);
          if (event) event.target.blur();
        }, err => {
          item.setIsInitRequest(false);
        })
    }
  }
  onRemoveIndustries() {
    forkJoin(this.crmStateService.getListIndustriesForRemove().map(item => this.crmService.removeIndustry(item.id).pipe(map((res) => res),
      catchError(error => of(undefined)))))
      .subscribe(
        () => {
          this.confirmStateService.initRequest(false);
          this.crmStateService.setListIndustriesForRemove([]);
          this.cd.detectChanges();
        },
        error => {
          this.confirmStateService.initRequest(false);
        }
      );
  }
  onRemoveIndustry(id) {
    this.crmService.removeIndustry(id).subscribe(data => {
      this.confirmStateService.initRequest(false);
      this.crmStateService.setListIndustriesForRemove([]);
      this.cd.detectChanges();
    }, err => {
      this.confirmStateService.initRequest(false);
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
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.header = `Delete Industry`;
    modalRef.componentInstance.message = `Are you sure you want to delete this industry?`;
    this.crmStateService.setIndustryForRemove(item);
  }
  ngOnDestroy(): void {
    this.crmStateService.setListIndustriesForRemove([]);
    this.sub.unsubscribe();
  }

}
