import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { SubscriptionServicesService } from 'src/app/services/subscription-services/subscription-services.service';
import { SubscriptionServices } from './class/subscription-services';
import { fadeInAnimation } from 'src/app/animations';
import { Subscription } from 'rxjs';
import { ConfirmStateService } from '../../shared/confirm/services/confirm-state.service';
import { LeftPanelStateService } from 'src/app/states/left-panel/left-panel-state.service';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
import { SubscriptionServicesStateService } from 'src/app/states/subscription-services/subscription-services-state.service';

@Component({
  selector: 'app-subscription-services',
  animations: [fadeInAnimation],
  // attach the fade in animation to the host (root) element of this component
  host: { '[@fadeInAnimation]': '' },
  templateUrl: './subscription-services.component.html',
  styleUrls: ['./subscription-services.component.scss']
})
export class SubscriptionServicesComponent implements OnInit, OnDestroy {
  showPreloader: boolean = true;
  showEditService: boolean = false;
  editService: SubscriptionServices;
  list: Array<SubscriptionServices> = [];
  sub: Subscription = new Subscription();
  constructor(private subscriptionServicesService: SubscriptionServicesService,
    private confirmStateService: ConfirmStateService,
    private leftPanelStateService: LeftPanelStateService,
    private permissionsService: PermissionsService,
    private subscriptionServicesStateService: SubscriptionServicesStateService,
    public cd: ChangeDetectorRef,) { }


  ngOnInit() {
    this.leftPanelStateService.setBillingPage('subscription-services');
    this.subscriptionServicesService.getServices().subscribe((data: Array<SubscriptionServices>) => {
      this.list = data.map(item => new SubscriptionServices(item)).sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
        1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));
      this.showPreloader = false;
      this.cd.detectChanges();
    })
    /* let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
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
     this.sub.add(changeServiceArray);*/
  }
  /* public removeService(service) {
     this.nonContractServicesService.deleteService(service.versionedId.id).subscribe(data => {
 
     })
   }
  
   onEditService(service) {
     this.editService = new NonContractServices(JSON.parse(JSON.stringify(service)));
     this.nonContractServicesStateService.toggleAsideForEdit(this.editService);
     this.showEditService = true;
   }*/
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
