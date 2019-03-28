import { Component, OnInit, Inject } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { UpgradeModule } from "@angular/upgrade/static";
import {setUpLocationSync} from '@angular/router/upgrade';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private upgrade: UpgradeModule){}

  ngOnInit() {
    this.upgrade.bootstrap(document.body, ['quicktech']);
    setUpLocationSync(this.upgrade);

  }
}
