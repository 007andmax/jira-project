import { Component, Input, OnInit } from '@angular/core';
import { TicketGlobalFilter } from '../../class/ticket-global-filter';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmStateService } from 'src/app/components/shared/confirm/services/confirm-state.service';
import { TicketsService } from 'src/app/services/tickets/tickets.service';

@Component({
  selector: 'tickets-filter-save',
  templateUrl: './tickets-filter-save.component.html',
  styleUrls: ['./tickets-filter-save.component.scss']
})
export class TicketsFilterSaveComponent implements OnInit {

  @Input() globalFilter: TicketGlobalFilter;
  constructor(public activeModal: NgbActiveModal,
    private confirmStateService: ConfirmStateService,
    private ticketsService: TicketsService,) { }

  ngOnInit() {
    console.log("globalFilter", this.globalFilter);
  }
  cancelConfirm() {
    this.activeModal.close();
    this.confirmStateService.setConfirm(false);
  };
  save() {
    if (this.globalFilter.name.length == 0) return;
    if (!this.globalFilter.id) {
      this.ticketsService.addGlobalFilter(this.globalFilter.getDataForRequest()).subscribe(data => {
        this.cancelConfirm();
      })
    } else {
      this.ticketsService.editGlobalFilter(this.globalFilter.id, this.globalFilter.getDataForRequest()).subscribe(data => {
        this.cancelConfirm();
      })
    }

  }

}
