import { ChangeDetectorRef, Component, ElementRef } from '@angular/core';
import { TicketStatus } from 'src/app/components/setting/ticket-settings-page/tickets-status/class/ticket-status';
import { TicketsFilterCompaniesDropDownComponent } from 'src/app/components/tickets/tickets/tickets-header/tickets-filter/tickets-filter-companies-drop-down/tickets-filter-companies-drop-down.component';
import { TicketPreviewReportStatus } from '../class/ticket-preview-report-status';
import { CompaniesService } from 'src/app/services/company/companies.service';
import { DevicesService } from 'src/app/services/devices/devices.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { CustomerPortalStateService } from 'src/app/states/customer-portal/customer-portal-state.service';
import { TicketsStateService } from 'src/app/states/tickets/tickets-state.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { DynamicTooltipComponent } from 'src/app/components/shared/dynamic-tooltip/dynamic-tooltip.component';
import { MatChipListComponent } from 'src/app/components/shared/mat-chip-list/mat-chip-list.component';
import { MatChipComponent } from 'src/app/components/shared/mat-chip/mat-chip.component';
import { MatFormFieldComponent } from 'src/app/components/shared/mat-form-field/mat-form-field.component';
import { MatErrorComponent } from 'src/app/components/shared/mat-error/mat-error.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ticket-preview-report-status-drop-down',
  templateUrl: './ticket-preview-report-status-drop-down.component.html',
  styleUrls: ['./ticket-preview-report-status-drop-down.component.scss'],
  standalone: true,
  imports: [NgbDropdown, CommonModule, MatFormFieldComponent, MatChipListComponent, DynamicTooltipComponent, MatChipComponent, MatErrorComponent]
})
export class TicketPreviewReportStatusDropDownComponent extends TicketsFilterCompaniesDropDownComponent {
  ticketsStatus: Array<TicketStatus> = [];

  constructor(public elRef: ElementRef,
    public companiesStateService: CompaniesStateService,
    public usersStateService: UsersStateService,
    public customerPortalStateService: CustomerPortalStateService,
    public companiesService: CompaniesService,
    public devicesService: DevicesService,
    public ref: ChangeDetectorRef,
    public ticketsStateService: TicketsStateService,) {
    super(elRef, companiesStateService, usersStateService, customerPortalStateService, companiesService, devicesService, ref);
  }

  ngOnInit() {
    if (this.class.length > 0) this.class = this.class;
    if (this.uiType) this.class.push(this.uiType);
    if (this.ref) this.ref.markForCheck();

    this.ticketsStatus = this.ticketsStateService.getTicketsStatus();
    if (this.ticketsStatus.length > 0) this.setList();
    let onGetTicketsStatus = this.ticketsStateService.onGetTicketsStatus.subscribe(data => {
      this.ticketsStatus = data;
      this.setList();
    })
    this.sub.add(onGetTicketsStatus);
    let getOnUpdateTicket = this.ticketsStateService.getOnUpdateTicket().subscribe(data => {
      this.setList();
      this.ref.detectChanges();
    })
    this.sub.add(getOnUpdateTicket);
  }
  setList() {
    this.list = [];
    this.ticketsStatus.forEach(item => {
      if (item.name !== 'UNASSIGNED') this.list.push(new TicketPreviewReportStatus(item.id, this.parseStatus(item.name), item.name));
    })
    if (this.selectedItems.length == 0) this.selectedItems = [this.list.find(item => item.type == "PENDING_REVIEW")];
  }
  parseStatus(name) {
    if (name === "IN_PROGRESS") return "In progress";
    if (name === "ON_HOLD") return "On hold";
    if (name === "COMPLETED") return "Completed";
    if (name === "UNASSIGNED") return "Unassigned";
    if (name === "PENDING_REVIEW") return "Pending Review";
    return name;
  }
}
