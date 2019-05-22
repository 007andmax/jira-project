import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-left-panel',
  templateUrl: './left-panel.component.html',
  styleUrls: ['./left-panel.component.scss']
})
export class LeftPanelComponent implements OnInit {

  public appType: string;


  constructor(
    private router: Router
  ) {
  }

  ngOnInit() {

    this.router.events
      .subscribe((event) => {
        const appType = this.router.url.startsWith('/ng2/quotes') ? '/ng2/quotes' : 'ng1';
        this.setAppType(appType);
      });
  }

  setAppType(appType) {
    this.appType = appType;
  }

  isAppTypeIsNg2() {
    return this.appType == '/ng2/quotes';
  }

}
