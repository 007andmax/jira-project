import { PreloaderTicketComponent } from './';
import { TicketDetailProfileFormUpdateHeaderComponent } from './';
import { TicketProfileFormUpdateNoteListComponent } from './';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TicketDetailProfileFormUpdateComponent } from '../ticket-detail-profile-form-update/ticket-detail-profile-form-update.component';
import { NgbModalConfig, NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TicketsListService } from '../../services/tickets-list.service';
import { CompaniesService } from 'src/app/services/company/companies.service';
import { DraftEmailService } from 'src/app/services/draft-email/draft-email.service';
import { AddUsersNotifyStateService } from 'src/app/services/modal/modal-add-users-notify/state/add-users-notify-state.service';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
import { SupportService } from 'src/app/services/support/support.service';
import { TicketsService } from 'src/app/services/tickets/tickets.service';
import { AppService } from 'src/app/states/app/app.service';
import { CustomerPortalStateService } from 'src/app/states/customer-portal/customer-portal-state.service';
import { DevicesRealTimeService } from 'src/app/states/devices/devices-real-time.service';
import { SupportStateService } from 'src/app/states/support/support-state.service';
import { TicketsStateService } from 'src/app/states/tickets/tickets-state.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { TicketStateService } from '../../ticket-edit-aside/services/ticket-state.service';
import { TicketDetailProfileFormUpdateNoteComponent } from '../ticket-detail-profile-form-update/ticket-detail-profile-form-update-note/ticket-detail-profile-form-update-note.component';

@Component({
  standalone: true,
  imports: [PreloaderTicketComponent, TicketDetailProfileFormUpdateHeaderComponent, TicketProfileFormUpdateNoteListComponent, CommonModule],
    selector: 'app-ticket-detail-note-modal',
    templateUrl: './ticket-detail-note-modal.component.html',
    styleUrls: ['./ticket-detail-note-modal.component.scss'],
    providers: [TicketsListService, NgbModalConfig, NgbModal],
    standalone: true
})
export class TicketDetailNoteModalComponent extends TicketDetailProfileFormUpdateComponent {
  @ViewChild('selectNote', { static: true }) selectNote: TicketDetailProfileFormUpdateNoteComponent;
  constructor(public ticketsStateService: TicketsStateService,
    public cd: ChangeDetectorRef,
    public usersStateService: UsersStateService,
    public ticketsService: TicketsService,
    public elRef: ElementRef,
    public modalService: NgbModal,
    public supportService: SupportService,
    public supportStateService: SupportStateService,
    public devicesRealTimeService: DevicesRealTimeService,
    public draftEmailService: DraftEmailService,
    public ticketStateService: TicketStateService,
    public appService: AppService,
    public companiesService: CompaniesService,
    public permissionsService: PermissionsService,
    public addUsersNotifyStateService: AddUsersNotifyStateService,
    public customerPortalStateService: CustomerPortalStateService,
    public activeModal: NgbActiveModal,
    public ticketsListService: TicketsListService) {
    super(ticketsStateService, cd, usersStateService, ticketsService, elRef, supportService, supportStateService,
      devicesRealTimeService, draftEmailService, ticketStateService, appService, companiesService, permissionsService,
      addUsersNotifyStateService, customerPortalStateService, modalService, ticketsListService
    )
  }
  close() {
    this.onCloseForm.emit(null);
    this.activeModal.close();
  }
}
