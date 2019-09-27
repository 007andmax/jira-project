import { Component, OnInit, Renderer2, Inject } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';

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
      if (appType === 'ng2') {
        this.renderer.addClass(this.document.body, 'ng7');
      } else {
        this.renderer.removeClass(document.body, 'ng7');
      }
    });
  }

  ngOnInit() {}

  setAppType(appType) {
    this.appType = appType;
  }

  isAppTypeIsNg2() {
    return this.appType === 'ng2';
  }
}
