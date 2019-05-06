import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

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
        const appType = this.router.url.startsWith('/ng2') ? 'ng2' : 'ng1';
        this.setAppType(appType);
      });
  }

  ngOnInit() {
  }

  setAppType(appType) {
    this.appType = appType;
  }

  isAppTypeIsNg2() {
    return this.appType == 'ng2';
  }

}
