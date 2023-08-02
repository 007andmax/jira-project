import { Component, OnDestroy, OnInit } from '@angular/core';
import { TicketGlobalFilter } from '../../class/ticket-global-filter';
import { TicketsStateService } from 'src/app/states/tickets/tickets-state.service';
import { DELETE_GLOBAL_FILTER } from 'src/app/const/confirm';
import { ConfirmComponent } from 'src/app/components/shared/confirm/confirm.component';
import { ConfirmStateService } from 'src/app/components/shared/confirm/services/confirm-state.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { TicketsService } from 'src/app/services/tickets/tickets.service';
import { TicketsFilterEditComponent } from '../tickets-filter-edit/tickets-filter-edit.component';

@Component({
  selector: 'tickets-filter-info',
  templateUrl: './tickets-filter-info.component.html',
  styleUrls: ['./tickets-filter-info.component.scss']
})
export class TicketsFilterInfoComponent implements OnInit, OnDestroy {
  sub: Subscription = new Subscription();
  globalFilter: TicketGlobalFilter;
  constructor(private ticketsStateService: TicketsStateService,
    private confirmStateService: ConfirmStateService,
    private ticketsService: TicketsService,
    private modalService: NgbModal,) { }

  ngOnInit() {
    this.ticketsStateService.onInitGlobalFilter.subscribe((data: TicketGlobalFilter) => {
      this.globalFilter = data;
    })
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === DELETE_GLOBAL_FILTER) this.onDeleteGlobalFilter(this.ticketsStateService.getGlobalFilterForRemove());
      }
    })
    this.sub.add(getConfirm);
  }
  public onDeleteGlobalFilter(filter) {
    this.ticketsService.deleteGlobalFilter(filter.id).subscribe(data => {

    })
  }
  editFilter() {
    const modalRef = this.modalService.open(TicketsFilterEditComponent, { windowClass: 'xs-modal user-modal', container: "app-tickets", backdrop: 'static', keyboard: false });
    modalRef.componentInstance.globalFilter = this.globalFilter;
  }
  removeFilter() {
    this.confirmStateService.setConfirmAction(DELETE_GLOBAL_FILTER);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
    this.ticketsStateService.setGlobalFilterForRemove(this.globalFilter);
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
