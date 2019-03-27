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

  public appType = 'ng1';


  constructor(private upgrade: UpgradeModule, private router: Router){

  }

  ngOnInit() {
    var t0 = performance.now();
    this.upgrade.bootstrap(document.body, ['quicktech']);
    setUpLocationSync(this.upgrade);
    console.log('tests');
    this.router.events
      .subscribe((event:NavigationStart) => {
        this.appType = this.router.url.startsWith('/ng2') ? 'ng2' : 'ng1';
      });
    var t1 = performance.now();
    console.log("Call to doSomething took " + (t1 - t0) + " milliseconds.")
  }

  isAppTypeIsNg2() {
    return  this.appType === 'ng2';
  }

}
