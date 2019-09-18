import { Component, OnInit } from '@angular/core';
// @ts-ignore
import { UpgradeModule } from "@angular/upgrade/static";
import { setUpLocationSync } from '@angular/router/upgrade';

import { UsersService } from "./services/users/users.service";
import { WebsocketService } from "./services/websocket/websocket.service";
import { UsersStateService } from './states/users/users-state.service';
import { DevicesSateService } from './states/devices/devices-sate.service';

/**
 * Root component
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  /**
   * Creates an instance of the MainComponent with the injected services
   * @param {UpgradeModule} upgrade service
   * @param {UsersService} userService service
   * @param {WebsocketService} websocketService service
   */
  constructor(
    private upgrade: UpgradeModule,
    private userService: UsersService,
    private usersStateService: UsersStateService,
    private websocketService: WebsocketService,
    private devicesState:DevicesSateService
    
  ){}

  /**
   * Initializes root. See [ngOnInit]{@see OnInit#ngOnInit}
   */
  ngOnInit() {
    this.upgrade.bootstrap(document.body, ['quicktech']);
    setUpLocationSync(this.upgrade);
    this.devicesState.onInit();
    this.usersStateService.onInit();
  //  this.userService.getCurrentUser();
    this.websocketService.initializeWebSocketConnection();
 
  }

}
