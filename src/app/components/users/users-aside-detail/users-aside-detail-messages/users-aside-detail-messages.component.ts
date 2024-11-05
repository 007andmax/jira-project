import { Component, Input, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users/users.service';
import { User } from '../../class/user';
import { UserListService } from '../../services/user-list.service';
import { UserMessage } from './class/user-message';
import * as moment from "moment";
import { DomSanitizer } from '@angular/platform-browser';
import { UsersStateService } from 'src/app/states/users/users-state.service';

@Component({
  selector: 'users-aside-detail-messages',
  templateUrl: './users-aside-detail-messages.component.html',
  styleUrls: ['./users-aside-detail-messages.component.scss'],
  providers: [UserListService]
})
export class UsersAsideDetailMessagesComponent implements OnInit {
  @Input() user: User;
  showPreloader = true;
  messages: Array<UserMessage> = [];
  public page_number: number = 0;
  public infiniteScrollDisabled = true;
  constructor(private usersService: UsersService,
    private sanitized: DomSanitizer,
    private usersStateService: UsersStateService,
    private userListService: UserListService,) { }

  ngOnInit() {
    this.onScroll();
  }

  public onScroll() {
    this.infiniteScrollDisabled = true;
    this.getUsers();

  }
  private getUsers() {
    if (this.userListService.getBlockList()) {
      this.infiniteScrollDisabled = false;
      return;
    }
    this.usersService.getMessagesUser(this.user.id, this.page_number).subscribe((data: any) => {
      this.page_number += 1;
      this.messages = [...this.messages, ...data.emails.map(item => new UserMessage(item))];
      this.infiniteScrollDisabled = false;
      this.showPreloader = false;
      if (data.totalElements === this.messages.length) this.userListService.setBlockList(true);
    })
  }
  showFullMessage(data) {
    this.usersStateService.showMessageAside(data);
  }
  getBody(val) {
    let value = val;
    if (val && val.length >= 180) return value.substring(0, 180);
    return val;
  }
  public getHtml(text) {
    return this.sanitized.bypassSecurityTrustHtml(text);
  }
  public getDate(date) {
    return moment(new Date(date)).format('DD MMM');
  }
  public getTime(date) {
    return moment(new Date(date)).format('hh:mm A');
  }
  public trackById(index, item) {
    return item.id;
  }
}
