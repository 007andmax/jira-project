import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Subscription, of } from 'rxjs';
import { StatusColor } from 'src/app/components/tickets/class/status-color';
import { TicketStatus } from '../tickets-status/class/ticket-status';
import { TicketsPriority } from './class/tickets-priority';
import { TicketsStateService } from 'src/app/states/tickets/tickets-state.service';
import { TicketsService } from 'src/app/services/tickets/tickets.service';
import { catchError, map } from 'rxjs/operators';
import { ClickOtsideDirective } from 'src/app/directives/click-otside/click-otside.directive';
import { ConfirmStateService } from 'src/app/components/shared/confirm/services/confirm-state.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LeftPanelService } from 'src/app/services/left-panel/left-panel.service';
import { DELETE_TICKET_PRIORITY, DELETE_TICKET_STATUS } from 'src/app/const/confirm';
import { ConfirmComponent } from 'src/app/components/shared/confirm/confirm.component';

@Component({
  selector: 'app-tickets-priority',
  templateUrl: './tickets-priority.component.html',
  styleUrls: ['./tickets-priority.component.scss']
})
export class TicketsPriorityComponent implements OnInit {

  showAddPriority: boolean = false;
  addPriority: TicketsPriority = new TicketsPriority();
  ticketsPriorities: Array<TicketsPriority> = [];
  statusColors: Array<StatusColor> = [];
  editTicketsStatus: TicketStatus;
  sort = "ASC";
  @ViewChild('addPriorityBtn') addPriorityBtn: ClickOtsideDirective;
  sub: Subscription = new Subscription();
  constructor(private ticketsStateService: TicketsStateService,
    private ticketsService: TicketsService,
    private confirmStateService: ConfirmStateService,
    private modalService: NgbModal,
    public cd: ChangeDetectorRef,
    private leftPanelService: LeftPanelService,) { }

  ngOnInit() {
    let onTicketsPriorities = this.ticketsStateService.onTicketsPriorities.subscribe(data => {
      this.ticketsPriorities = data;
      this.cd.detectChanges();
    })
    this.sub.add(onTicketsPriorities);
    if (this.ticketsStateService.getTicketsPriorities().length === 0) {
      this.ticketsService.getTicketsPriorities().subscribe((data: any) => {
        this.ticketsPriorities = data.priorityLevels.map(item => new TicketsPriority(item)).sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
          1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));
        this.ticketsStateService.onSetTicketsPriorities(this.ticketsPriorities);
      })
    } else {
      this.ticketsPriorities = this.ticketsStateService.getTicketsPriorities();
    }
    this.getColors();
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === DELETE_TICKET_PRIORITY) this.onRemoveTicketPriority(this.ticketsStateService.getTicketPriorityForRemove().id);
      }
    })
    this.sub.add(getConfirm);
  }
  onRemoveTicketPriority(id) {
    this.ticketsService.removeTicketPriority(id).subscribe(data => {
      this.cd.detectChanges();
    })
  }

  toggleAddPriority(data) {
    this.showAddPriority = data;
    this.addPriority = new TicketsPriority();
  }
  setColor(i) {
    this.addPriority.color = i;
  }
  onEditTicketPriority(item) {
    if (item.isInitEdit) {
      if (item.name.length === 0 || item.disableUpdate) return;
      this.ticketsService.editPriority(item.id, item.getDataForEdit(item.name, item.color)).pipe(map((res) => res),
        catchError(error => of(undefined))).subscribe(data => {
          item.onInitEdit(false);
        })
    }
  }
  editColor(i, item) {
    item.color = i;
    item.onInitEdit(true);
    this.onEditTicketPriority(item);
  }
  onKeyUp(event) {
    if (event.keyCode === 13) this.onAddTicketPriority();
  }
  onAddTicketPriority() {
    if (this.addPriority.name.length === 0 || !this.addPriorityBtn.getInit() || this.addPriority.disableCreate) return;
    this.addPriorityBtn.setInit(false);
    this.ticketsService.addPriority(this.addPriority.name, this.addPriority.color).pipe(map((res) => res),
      catchError(error => of(undefined))).subscribe(data => {
        this.showAddPriority = false;
        this.addPriority = new TicketsPriority();
      }, err => {
        setTimeout(() => this.addPriorityBtn.setInit(true), 2000);
      })
  }
  onSelect(event, item) {
    if (event.target.checked) {
      this.ticketsStateService.getListTicketsPrioritiesForRemove().push(item);
    } else {
      let list = this.ticketsStateService.getListTicketsPrioritiesForRemove();
      let index = list.findIndex(item => item.id === item.id);
      if (index > -1) list.splice(index, 1);
      this.ticketsStateService.setListTicketsPrioritiesForRemove(list);
    }
    this.cd.detectChanges();
  }
  onToggleAll(event) {
    if (event.target.checked) {
      this.ticketsPriorities.forEach(item => {
        if (!item.isDefault) {
          if (!item.selected) this.ticketsStateService.getListTicketsPrioritiesForRemove().push(item);
          item.selected = true;
        }
      })
    } else {
      this.ticketsStateService.setListTicketsPrioritiesForRemove([]);
      this.ticketsPriorities.forEach(item => (item.selected = false));
    }
    this.cd.detectChanges();
  }
  resetEditTicketsStatus() {
    this.editTicketsStatus = null;
  }
  removeTicketPriority(data) {
    this.confirmStateService.setConfirmAction(DELETE_TICKET_PRIORITY);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.message = `Remove Ticket Priority`;
    this.ticketsStateService.setTicketPriorityForRemove(data);
  }
  getColors() {
    if (this.ticketsStateService.getListStatusColor().length === 0) {
      this.leftPanelService.getColors().subscribe((data: any) => {
        this.statusColors = data.map(item => new StatusColor(item.borderColor, item.textColor))
        this.ticketsStateService.onColorStatus(this.statusColors);
      })
    } else {
      this.statusColors = this.ticketsStateService.getListStatusColor();
    }
  }
  ngOnDestroy(): void {
    this.ticketsStateService.setListTicketsPrioritiesForRemove([]);
    this.ticketsPriorities.forEach(item => (item.selected = false))
    this.sub.unsubscribe();
  }

}
