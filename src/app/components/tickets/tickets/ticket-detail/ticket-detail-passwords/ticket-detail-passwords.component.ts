import { TicketDetailPasswordsItemComponent } from './';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { PasswordRecord } from 'src/app/components/password-manager/class/password-record';
import { TicketStateService } from '../../ticket-edit-aside/services/ticket-state.service';
import { Subscription } from 'rxjs';

@Component({
  standalone: true,
  imports: [TicketDetailPasswordsItemComponent, CommonModule],
  selector: 'ticket-detail-passwords',
  templateUrl: './ticket-detail-passwords.component.html',
  styleUrls: ['./ticket-detail-passwords.component.scss']
})
export class TicketDetailPasswordsComponent implements OnInit, OnDestroy {
  @Output() onShowMore = new EventEmitter<any>();
  toggleContainer: boolean = true;
  passwords: Array<PasswordRecord> = [];
  sub: Subscription = new Subscription();
  constructor(public ticketStateService: TicketStateService,) { }

  ngOnInit() {
    this.passwords = this.ticketStateService.getPasswords();
    let onGetPasswords = this.ticketStateService.onGetPasswords.subscribe(data => {
      this.passwords = data;
    })
    this.sub.add(onGetPasswords);
  }
  showMore() {
    this.onShowMore.emit(null);
  }
  public trackByIndex(index, item) {
    return index;
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
