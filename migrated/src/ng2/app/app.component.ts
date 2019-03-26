import { Component, OnInit, Inject } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { UpgradeModule } from "@angular/upgrade/static";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public appType = 'ng1';


  constructor(private upgrade: UpgradeModule, private router: Router){

  }

  ngOnInit() {
    this.upgrade.bootstrap(document.body, ['quicktech']);
    this.router.events
      .subscribe((event:NavigationStart) => {
        console.log(this.router.url, 'this.router.url');
        this.appType = this.router.url.startsWith('/ng2') ? 'ng2' : 'ng1';
        console.log(this.appType);
      });
  }

  isAppTypeIsNg2() {
    return  this.appType === 'ng2';
  }

}
