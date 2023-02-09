import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { User } from 'src/app/components/users/class/user';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { CurrentUser } from 'src/class/current-user/current-user';
import { TicketProfile } from '../../class/ticket-profile';
import { TicketsListService } from '../../services/tickets-list.service';

@Component({
  selector: 'ticket-detail-header',
  templateUrl: './ticket-detail-header.component.html',
  styleUrls: ['./ticket-detail-header.component.scss'],
  providers: [TicketsListService]
})
export class TicketDetailHeaderComponent implements OnInit, OnDestroy {
  @Input() ticketProfile: TicketProfile = new TicketProfile();
  @Output() onAddUpdate = new EventEmitter();
  currentUser: CurrentUser;
  dateTxt: string = "";
  interval;
  hour: number = 0;
  minute: number = 0;
  second: number = 0;
  constructor(private usersStateService: UsersStateService,
    public cd: ChangeDetectorRef,
    public ticketsListService: TicketsListService,) { }


  ngOnInit() {
    if (this.usersStateService.getCurrentUser()) this.currentUser = this.usersStateService.getCurrentUser();
    this.usersStateService.getOnGetCurrentuser().subscribe(data => {
      this.currentUser = data;
    })
    this.interval = setInterval(() => {
      if (this.second == 59) {
        if (this.minute == 59) {
          this.hour += 1;
          this.minute = 0;
          this.second = 0;
        } else {
          this.minute += 1;
        }
      } else {
        this.second += 1;
      }
      this.dateTxt = `${this.parseDate(this.hour)} hr : ${this.parseDate(this.minute)} min : ${this.parseDate(this.second)} sec`;
      this.cd.detectChanges();
    }, 1000);
  }
  parseDate(data) {
    return (data < 0) ? `0${data}` : data;
  }
  addUpdate(type) {
    this.onAddUpdate.emit(type);
  }
  ngOnDestroy(): void {
    if (this.interval) clearInterval(this.interval);
  }

}
