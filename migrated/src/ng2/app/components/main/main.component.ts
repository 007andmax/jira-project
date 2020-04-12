import { Component } from '@angular/core';
import { Router } from "@angular/router";

/**
 * Main component
 */
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {

  public appType: string;

  /**
   * Creates an instance of the MainComponent with the injected services
   * @param {Router} router to work with routes
   */
  public constructor(private router: Router) {
     this.router.events
      .subscribe((event) => {
        const appType = (this.router.url.startsWith('/ng2') || this.router.url.startsWith('/#/ng2')) ? 'ng2' : 'ng1';
        this.setAppType(appType);
      });
  }

  /**
   * set app type
   * @param appType - application type
   */
  public setAppType(appType) {
    this.appType = appType;
  }

  /**
   * check app type
   */
  public isAppTypeIsNg2() {
    return this.appType == 'ng2';
  }

}
