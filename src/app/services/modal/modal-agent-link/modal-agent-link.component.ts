import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { TicketProfile } from 'src/app/components/tickets/tickets/class/ticket-profile';
import { TicketsService } from '../../tickets/tickets.service';

@Component({
  selector: 'modal-agent-link',
  templateUrl: './modal-agent-link.component.html',
  styleUrls: ['./modal-agent-link.component.scss'],
  providers: [NgbModalConfig, NgbModal]
})
export class ModalAgentLinkComponent implements OnInit {
  @Input() devices = [];
  @Input() ticketProfile: TicketProfile = new TicketProfile();
  constructor(private ticketsService: TicketsService,
    public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }
  changeLinkedAgent(id) {
    this.ticketsService.linkedAgentToTicket(this.ticketProfile.id, id).subscribe(res => {
      this.close();
    })
  }
  close() {
    this.activeModal.dismiss('Cross click');
  }
}
