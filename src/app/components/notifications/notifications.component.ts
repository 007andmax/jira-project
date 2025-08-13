import { ChangeDetectorRef, Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotificationsService } from 'src/app/services/notifications/notifications.service';
import { NotificationsStateService } from 'src/app/states/notifications/notifications-state.service';
import { Notification } from './class/notification';
import { TicketsListService } from '../tickets/tickets/services/tickets-list.service';
import * as moment from "moment";
import { TicketStateService } from '../tickets/tickets/ticket-edit-aside/services/ticket-state.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { NotificationsRealTimeService } from 'src/app/states/notifications/notifications-real-time.service';
import { id } from '@swimlane/ngx-charts';
import { QuoteStateService } from 'src/app/states/quote/quote-state.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
  providers: [TicketsListService]
})
export class NotificationsComponent {
  opened = false;
  page: number = 0;
  onlyUnread: boolean = true;
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
    private ticketStateService: TicketStateService,
    private companiesStateService: CompaniesStateService,
    private notificationsRealTimeService: NotificationsRealTimeService,
    private quoteStateService: QuoteStateService,
  ) { }
  ngOnInit() {

    let getToggleAddTicket = this.notificationsStateService.onShowNotifications.subscribe(data => {
      this.opened = true;
      this.showPreloader = true;
      this.getNotifications();
    })
    this.sub.add(getToggleAddTicket);
    this.notificationsRealTimeService.changeArray.subscribe(data => {
      if (data.action == "USER_NOTIFICATION_DELETED") {
        let index = this.list.findIndex(item => item.id == data.data);
        if (index > -1) this.list.splice(index, 1);
      }
      if (data.action == "USER_NOTIFICATION_CREATED" && this.opened) {
        this.list.unshift(new Notification(data.data));
      }
    })
  }
  markAsRead(item) {
    this.notificationsService.markAsRead(item.id).subscribe(res => {
      item.read = true;
    })
  }
  remove(item) {
    this.notificationsService.remove(item.id).subscribe(res => {

    })
  }
  checkMarkAsReadAll() {
    return this.list.some(item => !item.read);
  }
  markAsReadAll() {
    this.notificationsService.markAsReadAll().subscribe(res => {
      this.list.forEach(item => item.read = true);
    })
  }
  parsedate(date) {
    return moment(date).format('DD MMM YYYY');
  }
  editTicket(item) {
    if (!item.read) this.markAsRead(item)
    this.ticketStateService.setTicketRoutingId(item.ticket.id);
    const url = `/#/${this.companiesStateService.getCurrentCompany().techDomain}/ticket/${item.ticket.id}`;
    window.open(url, '_blank');
  }
  editQuote(item) {
    this.quoteStateService.setPreview({ id: item.saleQuote.id });
  }
  public onScroll() {
    console.log("onScroll");
    this.infiniteScrollDisabled = true;
    this.getNotifications();
  }
  public setOnlyUnread(data) {
    this.onlyUnread = data;
  }
  public setDefaultScoll() {
    this.page = 0;
    this.list = [];
    this.infiniteScrollDisabled = true;
    this.showPreloader = true;
    this.ticketsListService.setBlockList(false);
    this.onScroll();
  }
  getNotifications() {
    if (this.ticketsListService.getBlockList()) {
      this.infiniteScrollDisabled = false;
      return;
    }
    this.notificationsService.getList(this.page, this.onlyUnread).subscribe((data: any) => {
      this.list = [...this.list, ...data.userNotifications.map(item => new Notification(item))];
      this.infiniteScrollDisabled = false;
      if (data.userNotifications.length < this.offset) this.ticketsListService.setBlockList(true);
      this.page += 1;
      this.showPreloader = false;
      this.showPendingPreloader = false;
      this.cd.detectChanges();
    })
  }
  getNotificationCounter() {
    return this.notificationsStateService.getUnreadCount();
  }
  closed() {
    this.opened = false;
    this.showPreloader = false;
    this.infiniteScrollDisabled = true;
    this.ticketsListService.setBlockList(false)
    this.page = 0;
    this.list = [];
  }
  public trackById(index, item) {
    return item.id;
  }
}
