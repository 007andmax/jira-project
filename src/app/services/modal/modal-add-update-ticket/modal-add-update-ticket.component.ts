import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { TicketStateService } from 'src/app/components/tickets/tickets/ticket-edit-aside/services/ticket-state.service';
import { AppService } from 'src/app/states/app/app.service';

@Component({
  selector: 'modal-add-update-ticket',
  templateUrl: './modal-add-update-ticket.component.html',
  styleUrls: ['./modal-add-update-ticket.component.scss'],
  providers: [NgbModalConfig, NgbModal]
})
export class ModalAddUpdateTicketComponent implements OnInit {

  constructor(private ticketStateService: TicketStateService,
    public appService: AppService,
    public activeModal: NgbActiveModal,) { }

  ngOnInit() {
  }
  setTabUpdate(data) {
    this.appService.toggleMobileAside(true);
    this.ticketStateService.setTabUpdate(data);
    this.activeModal.dismiss('Cross click');
  }

}
