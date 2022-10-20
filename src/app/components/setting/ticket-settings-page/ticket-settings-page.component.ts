import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin, Subscription } from 'rxjs';
import { DELETE_LIST_TICKET_STATUS } from 'src/app/const/confirm';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
import { TicketsService } from 'src/app/services/tickets/tickets.service';
import { NoteStateService } from 'src/app/states/note/note-state.service';
import { SettingStateService } from 'src/app/states/setting/setting-state.service';
import { TicketsStateService } from 'src/app/states/tickets/tickets-state.service';
import { ConfirmComponent } from '../../shared/confirm/confirm.component';
import { ConfirmStateService } from '../../shared/confirm/services/confirm-state.service';
import { InvoiceTicketsService } from '../accounting/accounting-settings.service';
import { CannedResponsesComponent } from './canned-responses/canned-responses.component';
import { TicketSettingsComponent } from './ticket-settings/ticket-settings.component';
import { TicketsStatusComponent } from './tickets-status/tickets-status.component';
declare var $: any;
@Component({
  selector: 'ticket-settings-page',
  templateUrl: './ticket-settings-page.component.html',
  styleUrls: ['./ticket-settings-page.component.scss']
})
export class TicketSettingsPageComponent implements OnInit, OnDestroy {
  loading = false;
  activeTab: string = "ticketSettings";
  sub: Subscription = new Subscription();
  @ViewChild('ticketSettings') ticketSettings: TicketSettingsComponent;
  @ViewChild('ticketsStatus') ticketsStatus: TicketsStatusComponent;
  @ViewChild('cannedResponses') cannedResponses: CannedResponsesComponent;
  constructor(private invoiceTicketsService: InvoiceTicketsService,
    private confirmStateService: ConfirmStateService,
    private modalService: NgbModal,
    private ticketsService: TicketsService,
    public cd: ChangeDetectorRef,
    private permissionsService: PermissionsService,
    private noteStateService: NoteStateService,
    private ticketsStateService: TicketsStateService,
    private settingStateService: SettingStateService) { }

  ngOnInit() {
    $('body').addClass('page-settings');
    $('body').removeClass('backMenu');

    this.settingStateService.setComponentName('InvoiceTicketsComponent');
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === DELETE_LIST_TICKET_STATUS) {
          this.onRemoveTicketsStatus();
        }
      }
    })
    this.sub.add(getConfirm);
  }
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }
  onSubmit() {
    if (this.ticketSettings) this.ticketSettings.onSubmit();
  }
  create() {
    this.ticketsStatus.toggleAddStatus(true);
  }
  createResponse() {
    this.noteStateService.openAddAside();
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
    $('body').removeClass('page-settings');
  }
  setTab(data) {
    this.activeTab = data['nextId'];
  }
  getSelectedCount() {
    return this.ticketsStateService.getListTicketStatusForRemove().length;
  }
  onBackMenu() {
    let body = document.getElementsByTagName("body")[0];
    body.classList.remove("backMenu"); //remove the class
    body.classList.add("backMenu");
  }
  onRemoveTicketsStatus() {
    forkJoin(this.ticketsStateService.getListTicketStatusForRemove().map(item => this.ticketsService.removeTicketStatus(item.id)))
      .subscribe(
        () => {
          this.ticketsStateService.setListTicketStatusForRemove([]);
          this.cd.detectChanges();
        },
        error => {
        }
      );
  }
  removeTicketsStatus() {
    this.confirmStateService.setConfirmAction(DELETE_LIST_TICKET_STATUS);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.message = `Remove Ticket Status`;
    //this.ticketsStateService.setListTicketStatusForRemove(this.ticketsStatus.ticketsStatus.filter(item => item.selected));
  }
}

