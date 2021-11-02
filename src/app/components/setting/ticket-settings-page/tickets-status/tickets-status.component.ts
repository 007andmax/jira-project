import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { ConfirmComponent } from 'src/app/components/shared/confirm/confirm.component';
import { ConfirmStateService } from 'src/app/components/shared/confirm/services/confirm-state.service';
import { StatusColor } from 'src/app/components/tickets/class/status-color';
import { DELETE_TICKET_STATUS } from 'src/app/const/confirm';
import { LeftPanelService } from 'src/app/services/left-panel/left-panel.service';
import { TicketsService } from 'src/app/services/tickets/tickets.service';
import { TicketsStateService } from 'src/app/states/tickets/tickets-state.service';
import { TicketStatus } from '../../customizable-lists/class/ticket-status';

@Component({
  selector: 'tickets-status',
  templateUrl: './tickets-status.component.html',
  styleUrls: ['./tickets-status.component.scss']
})
export class TicketsStatusComponent implements OnInit, OnDestroy {
  showAddStatus: boolean = false;
  addStatus: TicketStatus = new TicketStatus();
  ticketsStatus: Array<TicketStatus> = [];
  statusColors: Array<StatusColor> = [];
  editTicketsStatus: TicketStatus;
  sub: Subscription = new Subscription();
  constructor(private ticketsStateService: TicketsStateService,
    private ticketsService: TicketsService,
    private confirmStateService: ConfirmStateService,
    private modalService: NgbModal,
    private leftPanelService: LeftPanelService,) { }

  ngOnInit() {

    this.ticketsStatus = this.ticketsStateService.getTicketsStatus();
    let onGetTicketsStatus = this.ticketsStateService.onGetTicketsStatus.subscribe(data => {
      this.ticketsStatus = data;
    })
    this.sub.add(onGetTicketsStatus);
    this.getColors();
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === DELETE_TICKET_STATUS) {
          this.onRemoveTicketStatus(this.ticketsStateService.getTicketStatusForRemove().id);
        }
      }
    })
    this.sub.add(getConfirm);
  }
  onRemoveTicketStatus(id) {
    this.ticketsService.removeTicketStatus(id).subscribe(data => {

    })
  }
  toggleAddStatus(data) {
    this.showAddStatus = data;
  }
  setColor(i) {
    this.addStatus.color = i;
  }
  onAddTicketStatus() {
    if (this.addStatus.name.length === 0) return;
    this.ticketsService.addStatus(this.addStatus.name, this.addStatus.color).subscribe(data => {
      this.showAddStatus = false;
      this.addStatus = new TicketStatus();
    })
  }
  resetEditTicketsStatus() {
    this.editTicketsStatus = null;
  }
  removeTicketStatus(data) {
    this.confirmStateService.setConfirmAction(DELETE_TICKET_STATUS);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal' });
    modalRef.componentInstance.message = `Do you want to delete this status?`;
    this.ticketsStateService.setTicketStatusForRemove(data);
  }
  getColors() {
    if (this.ticketsStateService.getListStatusColor().length === 0) {
      this.leftPanelService.getColors().subscribe((data: any) => {
        this.statusColors = data.map(item => {
          return new StatusColor(item.borderColor);
        })
      })
    } else {
      this.statusColors = this.ticketsStateService.getListStatusColor();
    }
  }
  ngOnDestroy(): void {

    this.sub.unsubscribe();
  }
}
