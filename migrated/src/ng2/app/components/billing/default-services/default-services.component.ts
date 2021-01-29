import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { DefaultServices } from './class/default-service';
import { DefaultServicesService } from 'src/ng2/app/services/default-services/default-services.service';
import { DefaultServicesFilter } from './class/default-services-filter';
import { ConfirmStateService } from '../../shared/confirm/services/confirm-state.service';
import { REMOVE_DEFAULT_SERVICE } from 'src/ng2/app/const/confirm';
import { DefaultServicesStateService } from 'src/ng2/app/states/default-services/default-services-state.service';
import { Subscription } from 'rxjs';
import { DefaultServicesRealTimeService } from 'src/ng2/app/states/default-services/default-services-real-time.service';
import { LeftPanelStateService } from 'src/ng2/app/states/left-panel/left-panel-state.service';

@Component({
  selector: 'default-services',
  templateUrl: './default-services.component.html',
  styleUrls: ['./default-services.component.scss']
})
export class DefaultServicesComponent implements OnInit, OnDestroy {
  showPreloader: boolean = true;
  showEditService: boolean = false;
  editService: DefaultServices;
  list: Array<DefaultServices> = [];
  filter: DefaultServicesFilter = new DefaultServicesFilter();
  sub: Subscription = new Subscription();
  constructor(private defaultServicesService: DefaultServicesService,
    private defaultServicesStateService: DefaultServicesStateService,
    private defaultServicesRealTimeService: DefaultServicesRealTimeService,
    private confirmStateService: ConfirmStateService,
    private leftPanelStateService: LeftPanelStateService,
    public cd: ChangeDetectorRef,) { }


  ngOnInit() {
    this.leftPanelStateService.setBillingPage('new-services');
    this.defaultServicesService.getDefaultServices().subscribe((data: Array<DefaultServices>) => {
      this.list = data;
      this.filter.onFilter('name', this.list);
      this.showPreloader = false;
      this.cd.detectChanges();
    })
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === REMOVE_DEFAULT_SERVICE) this.removeService(this.defaultServicesStateService.getServiceForRemove());
      }
    })
    this.sub.add(getConfirm);
    let changeServiceArray = this.defaultServicesRealTimeService.changeServiceArray.subscribe(newChange => {
      if (newChange.action === 'SERVICE_SAVED') {
        const Index = this.list.findIndex((item) => item.versionedId.id === newChange.data.versionedId.id);
        if (Index > -1) this.list[Index] = new DefaultServices(newChange.data);
        if (Index === -1) this.list.unshift(new DefaultServices(newChange.data));

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
    this.defaultServicesService.deleteService(service.versionedId.id).subscribe(data => {

    })
  }
  onShowAddAside() {
    this.defaultServicesStateService.toggleAsideForAdd();
  }
  onEditService(service) {
    this.editService = new DefaultServices(JSON.parse(JSON.stringify(service)));
    this.defaultServicesStateService.toggleAsideForEdit(this.editService);
    this.showEditService = true;
  }
  public onFilter(field) {
    this.filter.onFilter(field, this.list);
    this.cd.detectChanges();
  }
  public trackById(index, item) {
    return item.id;
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
