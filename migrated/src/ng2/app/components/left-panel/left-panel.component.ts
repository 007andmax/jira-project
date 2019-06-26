import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

/**
 * Left panel component
 */
@Component({
  selector: 'app-left-panel',
  templateUrl: './left-panel.component.html',
  styleUrls: ['./left-panel.component.scss']
})
export class LeftPanelComponent implements OnInit {

  public appType: string;

  /**
   * Creates an instance of the LeftPanelComponent with the injected services
   * @param {Router} router Service to work with router
   */
  constructor(
    private router: Router
  ) {}

  /**
   * Initializes left panel. See [ngOnInit]{@see OnInit#ngOnInit}
   */
  ngOnInit() {
    this.router.events
      .subscribe((event) => {
        const appType = this.router.url.startsWith('/ng2/quotes') ? '/ng2/quotes' : 'ng1';
        this.setAppType(appType);
      });
  }

  /**
   * Set app type
   * @param appType - application type
   */
  setAppType(appType) {
    this.appType = appType;
  }

  /**
   * Check application type
   */
  isAppTypeIsNg2() {
    return this.appType == '/ng2/quotes';
  }

}
