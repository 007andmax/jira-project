import { Component, OnInit } from '@angular/core';
import { UpgradeModule } from "@angular/upgrade/static";
import { setUpLocationSync } from '@angular/router/upgrade';

import { UsersService } from "./services/users/users.service";
import { RxStompService } from "@stomp/ng2-stompjs";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  private topicSubscription: Subscription;
  private receivedMessages: any;

  constructor(private upgrade: UpgradeModule,
              private userService: UsersService,
              private rxStompService: RxStompService
              ){}

  ngOnInit() {
    this.upgrade.bootstrap(document.body, ['quicktech']);
    setUpLocationSync(this.upgrade);
    this.userService.getCurrentUser();
    console.log('etstse');
    // this.userService.getNewCurrentUserPermissions();
    console.log(this.rxStompService, 'this.rxStompService');
    this.topicSubscription = this.rxStompService.subsribe('/user/watch/permissions').subscribe((message: any) => {
      this.receivedMessages.push(message.body);
      console.log(message);
    });

    this.rxStompService.connected$.subscribe((state) => {
      console.log(state, 'I will be called for each time connection is established.');
    });
  }

}
