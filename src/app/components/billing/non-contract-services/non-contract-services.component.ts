import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { NonContractServices } from './class/non-contract-service';
import { NonContractServicesService } from 'src/app/services/non-contract-services/non-contract-services.service';
import { NonContractServicesFilter } from './class/non-contract-services-filter';
import { ConfirmStateService } from '../../shared/confirm/services/confirm-state.service';
import { REMOVE_DEFAULT_SERVICE } from 'src/app/const/confirm';
import { NonContractServicesStateService } from 'src/app/states/non-contract-services/non-contract-services-state.service';
import { Subscription } from 'rxjs';
import { NonContractServicesRealTimeService } from 'src/app/states/non-contract-services/non-contract-services-real-time.service';
import { LeftPanelStateService } from 'src/app/states/left-panel/left-panel-state.service';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';

@Component({
  selector: 'non-contract-services',
  templateUrl: './non-contract-services.component.html',
  styleUrls: ['./non-contract-services.component.scss']
})
export class NonContractServicesComponent implements OnInit, OnDestroy {
  showPreloader: boolean = true;
  showEditService: boolean = false;
  editService: NonContractServices;
  list: Array<NonContractServices> = [];
  filter: NonContractServicesFilter = new NonContractServicesFilter();
  sub: Subscription = new Subscription();
  constructor(private nonContractServicesService: NonContractServicesService,
    private nonContractServicesStateService: NonContractServicesStateService,
    private nonContractServicesRealTimeService: NonContractServicesRealTimeService,
    private confirmStateService: ConfirmStateService,
    private leftPanelStateService: LeftPanelStateService,
    private permissionsService: PermissionsService,
    public cd: ChangeDetectorRef,) { }


  ngOnInit() {
    this.leftPanelStateService.setBillingPage('non-contract-services');
    this.nonContractServicesService.getNonContractServices().subscribe((data: Array<NonContractServices>) => {
      this.list = data;
      this.filter.onFilter('name', this.list);
      this.showPreloader = false;
      this.cd.detectChanges();
    })
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === REMOVE_DEFAULT_SERVICE) this.removeService(this.nonContractServicesStateService.getServiceForRemove());
      }
    })
    this.sub.add(getConfirm);
    let changeServiceArray = this.nonContractServicesRealTimeService.changeServiceArray.subscribe(newChange => {
      if (newChange.action === 'SERVICE_SAVED') {
        const Index = this.list.findIndex((item) => item.versionedId.id === newChange.data.versionedId.id);
        if (Index > -1) this.list[Index] = new NonContractServices(newChange.data);
        if (Index === -1) this.list.unshift(new NonContractServices(newChange.data));

      }
      if (newChange.action === 'SERVICE_DELETED') {
        const Index = this.list.findIndex((item) => item.versionedId.id === newChange.data.versionedId.id);
        if (Index > -1) this.list.splice(Index, 1);

      }
      this.cd.detectChanges();
    })
    this.sub.add(changeServiceArray);
  }
  public removeService(service) {
    this.nonContractServicesService.deleteService(service.versionedId.id).subscribe(data => {

    })
  }
  onShowAddAside() {
    this.nonContractServicesStateService.toggleAsideForAdd();
  }
  onEditService(service) {
    this.editService = new NonContractServices(JSON.parse(JSON.stringify(service)));
    this.nonContractServicesStateService.toggleAsideForEdit(this.editService);
    this.showEditService = true;
  }
  public onFilter(field) {
    this.filter.onFilter(field, this.list);
    this.cd.detectChanges();
  }
  public trackById(index, item) {
    return item.id;
  }
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
