
import { Component, OnInit, Renderer2, Inject } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';

/**
 * Main component
 */
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  public appType: string;

  constructor(
    private router: Router,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
  ) {
    this.router.events.subscribe(event => {
      const appType = this.router.url.startsWith('/ng2') ? 'ng2' : 'ng1';
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

  ngOnInit() {}
  isAppTypeIsNg2() {
    return this.appType === 'ng2';
  }
}
