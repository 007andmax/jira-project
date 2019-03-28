import { Component, OnInit } from '@angular/core';
import { NavigationStart, Router } from "@angular/router";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  public appType: string;

  constructor(private router: Router) {
     this.router.events
      .subscribe((event) => {
        console.log(this.router.url, 'this.router.url');
        console.log(this.appType, 'this.appType');
        console.log(this.appType === 'ng2');

        const appType = this.router.url.startsWith('/ng2') ? 'ng2' : 'ng1';
        this.setAppType(appType);
      });
     console.log(this.appType, '+++');
  }

  ngOnInit() {
  }

  setAppType(appType) {
    this.appType = appType;
    console.log(this.appType, 'this.appTypethis.appTypethis.appType');
  }

  isAppTypeIsNg2() {
    console.log(this.appType, '-----');
    return this.appType == 'ng2';
  }

}
