import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { SubscriptionServicesService } from 'src/app/services/subscription-services/subscription-services.service';
import { SubscriptionServices } from './class/subscription-services';
import { fadeInAnimation } from 'src/app/animations';
import { Subscription } from 'rxjs';
import { ConfirmStateService } from '../../shared/confirm/services/confirm-state.service';
import { LeftPanelStateService } from 'src/app/states/left-panel/left-panel-state.service';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
import { SubscriptionServicesStateService } from 'src/app/states/subscription-services/subscription-services-state.service';
import { REMOVE_SUBSCRIBE_SERVICE } from 'src/app/const/confirm';
import { SubscriptionServicesRealTimeService } from 'src/app/states/subscription-services/subscription-services-real-time.service';
import { SubscriptionServicesFilter } from './class/subscription-services-filter';
import { TaxesStateService } from 'src/app/states/taxes/taxes-state.service';
import { ServiceAgreement } from '../contracts/class/service-agreement';
import { ContractsStateService } from 'src/app/states/contracts/contracts-state.service';
import { TicketSortBy } from '../../tickets/tickets/class/ticket-sort-by';

@Component({
  selector: 'app-subscription-services',
  animations: [fadeInAnimation],
  // attach the fade in animation to the host (root) element of this component
  host: { '[@fadeInAnimation]': '' },
  templateUrl: './subscription-services.component.html',
  styleUrls: ['./subscription-services.component.scss']
})
export class SubscriptionServicesComponent implements OnInit, OnDestroy {
  serviceAgreement: ServiceAgreement;
  showEditContract: boolean = false;
  showPreloader: boolean = true;
  filter: SubscriptionServicesFilter = new SubscriptionServicesFilter();
  list: Array<SubscriptionServices> = [];
  sub: Subscription = new Subscription();
  sortBy: TicketSortBy = new TicketSortBy('name', 'ASC');
  constructor(private subscriptionServicesService: SubscriptionServicesService,
    private confirmStateService: ConfirmStateService,
    private leftPanelStateService: LeftPanelStateService,
    private permissionsService: PermissionsService,
    private subscriptionServicesStateService: SubscriptionServicesStateService,
    private subscriptionServicesRealTimeService: SubscriptionServicesRealTimeService,
    private taxesStateService: TaxesStateService,
    private contractsStateService: ContractsStateService,
    public cd: ChangeDetectorRef,) { }


  ngOnInit() {
    this.leftPanelStateService.setBillingPage('subscription-services');
    this.subscriptionServicesService.getServices().subscribe((data: Array<SubscriptionServices>) => {
      this.list = data.map(item => new SubscriptionServices(item)).sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
        1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));
      this.showPreloader = false;
      this.cd.detectChanges();
    })
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === REMOVE_SUBSCRIBE_SERVICE) this.removeService(this.subscriptionServicesStateService.getServiceForRemove());
      }
    })
    this.sub.add(getConfirm);
    let changeServiceArray = this.subscriptionServicesRealTimeService.changeServicesArray.subscribe(newChange => {
      if (newChange.action === 'SUBSCRIPTION_SERVICE_SAVED') {
        const Index = this.list.findIndex((item) => item.id === newChange.data.id);
        if (Index > -1) this.list[Index] = new SubscriptionServices(newChange.data);
        if (Index === -1) this.list.unshift(new SubscriptionServices(newChange.data));
      }
      if (newChange.action === 'SUBSCRIPTION_SERVICE_DELETED') {
        const Index = this.list.findIndex((item) => item.id === newChange.data);
        if (Index > -1) this.list.splice(Index, 1);
      }
      this.cd.detectChanges();
    })
    this.sub.add(changeServiceArray);
    let onFastAdd = this.subscriptionServicesStateService.onFastAdd.subscribe(data => {
      const Index = this.list.findIndex((item) => item.id === data.id);
      if (Index === -1) this.list.unshift(new SubscriptionServices(data));
    })
    this.sub.add(onFastAdd);
    let onFastEdit = this.subscriptionServicesStateService.onFastEdit.subscribe(data => {
      const Index = this.list.findIndex((item) => item.id === data.id);
      if (Index > -1) this.list[Index] = new SubscriptionServices(data);
    })
    this.sub.add(onFastEdit);
    let onFastRemove = this.subscriptionServicesStateService.onFastRemove.subscribe(data => {
      const Index = this.list.findIndex((item) => item.id === data);
      if (Index > -1) this.list.splice(Index, 1);
    })
    this.sub.add(onFastRemove);
    let getOnEdit = this.contractsStateService.getOnEdit().subscribe(data => {
      this.serviceAgreement = data;
      this.showEditContract = true;
      if (!this.cd['destroyed']) {
        this.cd.detectChanges();
      }
    })
    this.sub.add(getOnEdit);
    let getOnToggleEdit = this.contractsStateService.getOnToggleEdit().subscribe(data => {
      this.showEditContract = false;
      if (!this.cd['destroyed']) {
        this.cd.detectChanges();
      }
    })
    this.sub.add(getOnToggleEdit);
  }
  public removeService(service) {
    this.subscriptionServicesService.deleteService(service.id).subscribe(data => {
      this.confirmStateService.initRequest(false);
      this.subscriptionServicesStateService.fastRemoveService(service.id);
    }, err => {
      this.confirmStateService.initRequest(false);
    })
  }
  public onFilter(field) {
    this.sortBy.sortBy = field;
    this.filter.onFilter(field, this.list, this.taxesStateService.getTaxes());
    this.sortBy.sortDirection = this.filter.direction;
    this.cd.detectChanges();
  }

  onEditService(service) {
    this.subscriptionServicesStateService.toggleAsideForEdit(service);
  }
  onShowAddAside() {
    this.subscriptionServicesStateService.toggleAsideForAdd();
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
