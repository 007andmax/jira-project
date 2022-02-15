import { Component, OnInit } from '@angular/core';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { UserMessage } from '../class/user-message';
import * as moment from "moment";
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'users-aside-detail-messages-full-body',
  templateUrl: './users-aside-detail-messages-full-body.component.html',
  styleUrls: ['./users-aside-detail-messages-full-body.component.scss']
})
export class UsersAsideDetailMessagesFullBodyComponent implements OnInit {
  opened: boolean = false;
  message: UserMessage;
  toggleAllUsers: boolean = false;

  constructor(private usersStateService: UsersStateService,
    private sanitized: DomSanitizer,) { }

  ngOnInit() {
    this.usersStateService.openMessageAside.subscribe(data => {
      this.message = data;
      this.opened = true;
      document.body.querySelector("#message-body span").innerHTML = this.message.body;

    })
  }
  getCountUsers() {
    return this.message.recipientsFromSystem.length + this.message.otherRecipients.length;
  }
  getUserAvatarUrl(user) {
    if (!(user && user.avatar)) return '';

    if (user.id) {
      return `url(${'/users/' + (user.id || 'default') + '/image' + (user.avatar ? '.jpg?t=' + user.avatar.updatedAt :
        '')}) 0% 0% / cover no-repeat`
    } else if (user.avatar && user.avatar.origin && user.avatar.origin.id) {
      return `url(/file/${(user.avatar.origin.id)}.jpg) 0% 0% / cover no-repeat`;
    } else {
      return 'url(/users/default/image.jpg) 0% 0% / cover no-repeat';
    }
  };
  getUserName(user) {
    return `${user.firstName} ${user.lastName}`;
  }
  getNameForAvatar(user) {
    if (!user.avatar) return `${(user.firstName) ? user.firstName[0].toUpperCase() : ''}${(user.lastName) ? user.lastName[0].toUpperCase() : ''}`;
    return '';
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
}
