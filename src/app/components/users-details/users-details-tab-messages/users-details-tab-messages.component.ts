import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { UserListService } from '../../users/services/user-list.service';
import { User } from '../../users/class/user';
import { UserMessage } from './class/user-message';
import { DomSanitizer } from '@angular/platform-browser';
import * as moment from 'moment';
import { UsersService } from 'src/app/services/users/users.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { UsersDetailsTabMessagesFullBodyComponent } from './users-details-tab-messages-full-body/users-details-tab-messages-full-body.component';

@Component({
  standalone: true,
  imports: [CommonModule, UsersDetailsTabMessagesFullBodyComponent],
  selector: 'app-users-details-tab-messages',
  templateUrl: './users-details-tab-messages.component.html',
  styleUrls: ['./users-details-tab-messages.component.scss'],
  providers: [UserListService],

})
export class UsersDetailsTabMessagesComponent implements OnInit {
  @Input() user: User;
  showPreloader = true;
  messages: Array<UserMessage> = [];
  public page_number: number = 0;
  public infiniteScrollDisabled = true;
  showPendingPreloader: boolean = false;
  constructor(private usersService: UsersService,
    private sanitized: DomSanitizer,
    private usersStateService: UsersStateService,
    private userListService: UserListService,
    public cd: ChangeDetectorRef,) { }

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
    if (this.page_number > 0) this.showPendingPreloader = true;
    this.usersService.getMessagesUser(this.user.id, this.page_number).subscribe((data: any) => {
      this.page_number += 1;
      this.messages = [...this.messages, ...data.emails.map(item => new UserMessage(item))];
      this.infiniteScrollDisabled = false;
      this.showPreloader = false;
      this.showPendingPreloader = false;
      if (data.totalElements === this.messages.length) this.userListService.setBlockList(true);
      this.cd.detectChanges();
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
