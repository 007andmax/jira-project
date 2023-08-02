import { Component, Input, OnInit } from '@angular/core';
import { TicketGlobalFilter } from '../../class/ticket-global-filter';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmStateService } from 'src/app/components/shared/confirm/services/confirm-state.service';

@Component({
  selector: 'tickets-filter-edit',
  templateUrl: './tickets-filter-edit.component.html',
  styleUrls: ['./tickets-filter-edit.component.scss']
})
export class TicketsFilterEditComponent implements OnInit {
  @Input() globalFilter: TicketGlobalFilter;
  constructor(public activeModal: NgbActiveModal,
    private confirmStateService: ConfirmStateService,) { }

  ngOnInit() {
  }
  cancelConfirm() {
    this.activeModal.close();
    this.confirmStateService.setConfirm(false);
  };
}
