
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, Input } from '@angular/core';
import { DropDownComponent } from 'src/app/components/shared/drop-down/drop-down.component';
import { TicketsService } from 'src/app/services/tickets/tickets.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { TicketProfile } from '../../class/ticket-profile';
import { CustomerPortalStateService } from 'src/app/states/customer-portal/customer-portal-state.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { TicketsPermissionsService } from '../../ticket-edit-aside/services/tickets-permissions.service';
import { TicketsStateService } from 'src/app/states/tickets/tickets-state.service';
import { TicketsPriority } from 'src/app/components/setting/ticket-settings-page/tickets-priority/class/tickets-priority';
import { StatusColor } from '../../../class/status-color';
import { LeftPanelService } from 'src/app/services/left-panel/left-panel.service';
import { CompaniesService } from 'src/app/services/company/companies.service';
import { DevicesService } from 'src/app/services/devices/devices.service';
import { Subscription } from 'rxjs';
import { TicketStateService } from '../../ticket-edit-aside/services/ticket-state.service';
import { MatErrorComponent } from 'src/app/components/shared/mat-error/mat-error.component';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  standalone: true,
  imports: [MatErrorComponent, CommonModule, NgbDropdownModule],
  selector: 'ticket-detail-change-priority',
  templateUrl: './ticket-detail-change-priority.component.html',
  styleUrls: ['./ticket-detail-change-priority.component.scss']
})
export class TicketDetailChangePriorityComponent extends DropDownComponent {
  @Input() ticketProfile: TicketProfile = new TicketProfile();
  selectedPriority: TicketsPriority;
  statusColors: Array<StatusColor> = [];
  list: Array<TicketsPriority> = [];
  sub: Subscription = new Subscription();
  constructor(public elRef: ElementRef,
    public ticketsPermissionsService: TicketsPermissionsService,
    public companiesStateService: CompaniesStateService,
    public customerPortalStateService: CustomerPortalStateService,
    public usersStateService: UsersStateService,
    private ticketsStateService: TicketsStateService,
    private leftPanelService: LeftPanelService,
    public cd: ChangeDetectorRef,
    public ticketsService: TicketsService,
    public devicesService: DevicesService,
    public ticketStateService: TicketStateService,
    public companiesService: CompaniesService) {
    super(elRef, companiesStateService, usersStateService, customerPortalStateService, companiesService, devicesService, cd);

  }
  ngOnInit() {
    this.class = ['qt-dropdown'];
    this.field = 'name';
    this.isBlockClear = true;
    this.sort = false;
    this.selectedItem = this.ticketProfile.priorityLevel;
    if (this.class.length > 0) this.class = this.class;
    if (this.uiType) this.class.push(this.uiType);
    this.isDisabled = !(this.ticketsPermissionsService.isActionVisible('update', this.ticketProfile, null, null) && (this.customerPortalStateService.isCustomerPortal && this.isAddNoteForCustomerUser() || !this.customerPortalStateService.isCustomerPortal));
    if (this.ticketsStateService.getTicketsPriorities().length === 0) {
      this.ticketsService.getTicketsPriorities().subscribe((data: any) => {
        this.list = data.priorityLevels.map(item => new TicketsPriority(item)).sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
          1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));
        this.ticketsStateService.onSetTicketsPriorities(this.list);
      })
    } else {
      this.list = this.ticketsStateService.getTicketsPriorities();
    }
    if (this.ticketsStateService.getListStatusColor().length === 0) {
      this.leftPanelService.getColors().subscribe((data: any) => {
        this.statusColors = data.map(item => new StatusColor(item.borderColor, item.textColor))
        this.ticketsStateService.onColorStatus(this.statusColors);
      })
    } else {
      this.statusColors = this.ticketsStateService.getListStatusColor();
    }
    this.ticketStateService.onCloseTicket.subscribe(data => {
      this.isDisabled = true;
      this.cd.detectChanges();
    })
    this.ticketStateService.onOpenTicket.subscribe(data => {
      this.isDisabled = false;
      this.cd.detectChanges();
    })
    let getOnUpdateTicket = this.ticketsStateService.getOnUpdateTicket().subscribe(data => {
      this.isDisabled = !(this.ticketsPermissionsService.isActionVisible('update', this.ticketProfile, null, null) && (this.customerPortalStateService.isCustomerPortal && this.isAddNoteForCustomerUser() || !this.customerPortalStateService.isCustomerPortal));
      this.selectedItem = this.ticketProfile.priorityLevel;
      this.cd.detectChanges();
    })
    this.sub.add(getOnUpdateTicket);
  }
  isAddNoteForCustomerUser() {
    return this.customerPortalStateService.checkEditTicket(this.usersStateService.getCurrentUser(), this.ticketProfile.createdUserId, this.ticketProfile.companyId);
  }
  onSelect(data) {
    this.isAdd = false;
    this.selectedItem = data;
    this.ticketsService.changePriority({
      "ids": [
        this.ticketProfile.id
      ],
      "value": data.id
    }, this.ticketProfile.number).subscribe(res => {

    })
  }
}
