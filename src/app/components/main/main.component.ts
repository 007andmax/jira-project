
import { CommonModule } from '@angular/common';
import { Component, OnInit, Renderer2, Inject, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

/**
 * Main component
 */
@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit, OnDestroy {
  public appType: string;
  sub: Subscription = new Subscription();
  constructor(
    private router: Router,
  ) {
    let events = this.router.events.subscribe(event => {
      this.setAppType('ng2');
    });
    this.sub.add(events);
  }


  /**
   * set app type
   * @param appType - application type
   */
  public setAppType(appType) {
    this.appType = appType;
  }

  ngOnInit() { }
  isAppTypeIsNg2() {
    return this.appType === 'ng2';
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
