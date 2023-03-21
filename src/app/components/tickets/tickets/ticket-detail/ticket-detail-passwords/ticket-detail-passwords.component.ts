import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { PasswordRecord } from 'src/app/components/password-manager/class/password-record';
import { TicketStateService } from '../../ticket-edit-aside/services/ticket-state.service';

@Component({
  selector: 'ticket-detail-passwords',
  templateUrl: './ticket-detail-passwords.component.html',
  styleUrls: ['./ticket-detail-passwords.component.scss']
})
export class TicketDetailPasswordsComponent implements OnInit {

  @Output() onShowMore = new EventEmitter<any>();
  toggleContainer: boolean = true;
  passwords: Array<PasswordRecord> = [];
  constructor(public ticketStateService: TicketStateService,) { }

  ngOnInit() {
    this.passwords = this.ticketStateService.getPasswords();
    this.ticketStateService.onGetPasswords.subscribe(data => {
      this.passwords = data;
    })
  }
  showMore() {
    this.onShowMore.emit(null);
  }

}
