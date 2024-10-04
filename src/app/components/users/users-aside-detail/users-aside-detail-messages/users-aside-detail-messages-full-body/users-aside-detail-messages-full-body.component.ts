import { Component, OnDestroy, OnInit } from '@angular/core';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { UserMessage } from '../class/user-message';
import * as moment from "moment";
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

@Component({
  selector: 'users-aside-detail-messages-full-body',
  templateUrl: './users-aside-detail-messages-full-body.component.html',
  styleUrls: ['./users-aside-detail-messages-full-body.component.scss']
})
export class UsersAsideDetailMessagesFullBodyComponent implements OnInit, OnDestroy {
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
