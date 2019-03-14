import { Component, Inject } from '@angular/core';
// import { PHONE_SERVICE } from "ng2/app/phone.service";

import { UpgradeModule } from '@angular/upgrade/static';
import { MODULE_NAME } from '../ng1/app/scripts/core/app.mdl';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';

  phones: any[] = [];


  constructor(private upgrade: UpgradeModule) {
  }

  ngOnInit() {
    this.upgrade.bootstrap(document.body, ['quicktech']);
  }

}
