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
  headerText: string = "";
  page: string;
  public appType: string;

  /**
   * Creates an instance of the LeftPanelComponent with the injected services
   * @param {Router} router Service to work with router
   */
  constructor(
    private router: Router
  ) { }

  /**
   * Initializes left panel. See [ngOnInit]{@see OnInit#ngOnInit}
   */
  ngOnInit() {
    this.router.events
      .subscribe((event) => {
        const appType = this.router.url.startsWith('/ng2/quotes') ? '/ng2/quotes' : 'ng1';
        console.log("this.router.url", this.router.url);
        if (this.router.url.includes('ng2/companies')) {
          this.page = 'companies';
          this.headerText = 'Companies';
        }
        if (this.router.url.includes('ng2/company')) {
          this.page = 'company';
          this.headerText = 'Companies';
        }
        if (this.router.url.includes('ng2/tickets')) {
          this.page = 'tickets';
          this.headerText = 'Filters';
        }
        if (this.router.url.includes('ng2/users')) {
          this.page = 'users';
          this.headerText = 'Users';
        }
        if (this.router.url.includes('ng2/billable')) {
          this.page = 'billing';
          this.headerText = 'Billing';
        }
        if (this.router.url.includes('ng2/inventory')) {
          this.page = 'inventory';
          this.headerText = 'Inventory';
        }
        if (this.router.url.includes('ng2/password-manager')) {
          this.page = 'password-manager';
          this.headerText = 'Password';
        }
        if (this.router.url.includes('ng2/setting')) {
          this.page = 'settings';
          this.headerText = 'Settings';
        }
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
