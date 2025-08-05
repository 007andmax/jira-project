import { ChangeDetectorRef, Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotificationsService } from 'src/app/services/notifications/notifications.service';
import { NotificationsStateService } from 'src/app/states/notifications/notifications-state.service';
import { Notification } from './class/notification';
import { TicketsListService } from '../tickets/tickets/services/tickets-list.service';
import * as moment from "moment";

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
  providers: [TicketsListService]
})
export class NotificationsComponent {
  opened = false;
  page: number = 0;
  offset: number = 20;
  infiniteScrollDisabled = true;
  showPendingPreloader: boolean = false;
  showPreloader: boolean = true;
  list: Array<Notification> = [];
  sub: Subscription = new Subscription();
  container = document.body.querySelector(".main-container");
  constructor(private notificationsService: NotificationsService,
    private notificationsStateService: NotificationsStateService,
    private ticketsListService: TicketsListService,
    public cd: ChangeDetectorRef,
  ) { }
  ngOnInit() {

    let getToggleAddTicket = this.notificationsStateService.onShowNotifications.subscribe(data => {
      this.opened = true;
      this.getNotifications();
    })
    this.sub.add(getToggleAddTicket);
  }
  parsedate(date) {
    return moment(date).format('DD MMM YYYY');
  }
  public onScroll() {
    this.infiniteScrollDisabled = true;
    this.getNotifications();
  }
  getNotifications() {
    if (this.ticketsListService.getBlockList()) {
      this.infiniteScrollDisabled = false;
      return;
    }
    this.notificationsService.getList(this.page).subscribe((data: any) => {
      this.list = [...this.list, ...data.userNotifications.map(item => new Notification(item))];
      this.infiniteScrollDisabled = false;
      if (data.length < this.offset) this.ticketsListService.setBlockList(true);
      this.page += 1;
      this.showPreloader = false;
      this.showPendingPreloader = false;
      this.cd.detectChanges();
    })
  }
  closed() {
    this.opened = false;
    this.page = 0;
    this.list = [];
  }
  public trackById(index, item) {
    return item.id;
  }
}
