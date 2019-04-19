import { Component, OnInit } from '@angular/core';
// @ts-ignore
import { UpgradeModule } from "@angular/upgrade/static";
import { setUpLocationSync } from '@angular/router/upgrade';

import { UsersService } from "./services/users/users.service";
import { WebsocketService } from "./services/websocket/websocket.service";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private upgrade: UpgradeModule,
              private userService: UsersService,
              private websocketService: WebsocketService
              ){

  }

  ngOnInit() {
    this.upgrade.bootstrap(document.body, ['quicktech']);
    setUpLocationSync(this.upgrade);
    this.userService.getCurrentUser();
    this.websocketService.initializeWebSocketConnection();
  }

}
