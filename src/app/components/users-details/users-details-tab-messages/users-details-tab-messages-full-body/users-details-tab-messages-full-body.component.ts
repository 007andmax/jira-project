import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserMessage } from '../class/user-message';
import { Subscription } from 'rxjs';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { DomSanitizer } from '@angular/platform-browser';
import * as moment from "moment";
import { TicketProfileAttachmentsComponent } from 'src/app/components/tickets/tickets/ticket-edit-aside/ticket-profile-attachments/ticket-profile-attachments.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users-details-tab-messages-full-body',
  templateUrl: './users-details-tab-messages-full-body.component.html',
  styleUrls: ['./users-details-tab-messages-full-body.component.scss'],
  standalone: true,
  imports: [TicketProfileAttachmentsComponent, CommonModule]
})
export class UsersDetailsTabMessagesFullBodyComponent implements OnInit, OnDestroy {
  opened: boolean = false;
  message: UserMessage;
  toggleAllUsers: boolean = false;
  sub: Subscription = new Subscription();
  constructor(public usersStateService: UsersStateService,
    private sanitized: DomSanitizer,) { }

  ngOnInit() {
    let openMessageAside = this.usersStateService.openMessageAside.subscribe(data => {
      this.message = data;
      this.opened = true;
      document.body.querySelector("#message-body span").innerHTML = this.message.body;
    })
    this.sub.add(openMessageAside);
  }
  getCountUsers() {
    return (this.message) ? this.message.recipientsFromSystem.length + this.message.otherRecipients.length : '';
  }
  getUserName(user) {
    return `${user.firstName} ${user.lastName}`;
  }
  public getDate(date) {
    return moment(new Date(date)).format('DD MMM');
  }
  public getTime(date) {
    return moment(new Date(date)).format('HH:MM A');
  }
  public getHtml(text) {
    return this.sanitized.bypassSecurityTrustHtml(text);
  }
  close() {
    this.opened = false;
  }
  public trackById(index, item) {
    return item.id;
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
