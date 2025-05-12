import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { fadeInAnimation } from 'src/app/animations';
import { LeftPanelStateService } from 'src/app/states/left-panel/left-panel-state.service';


@Component({
  selector: 'app-item-report',
  templateUrl: './item-report.component.html',
  animations: [fadeInAnimation],
  // attach the fade in animation to the host (root) element of this component
  host: { '[@fadeInAnimation]': '' },
  styleUrls: ['./item-report.component.scss']
})
export class ItemReportComponent implements OnInit, OnDestroy {
  sub: Subscription = new Subscription();
  report: string;

  constructor(
    private leftPanelStateService: LeftPanelStateService,
    public cd: ChangeDetectorRef,
    public activateRoute: ActivatedRoute,
  ) { }


  ngOnInit() {
    if (localStorage.report) this.report = localStorage.report;
    $('body').addClass('qt-bg-white');
    let id = this.activateRoute.snapshot.params['id'];
    let subscription = this.activateRoute.params.subscribe(params => {
      id = params['id'];
      console.log("id", id);
      this.report = id;
      //   if (id && localStorage.report) this.report = localStorage.report;

    });
    this.sub.add(subscription);
  }
  back() {
    this.leftPanelStateService.goToState('new-reports' || 'new-device-summary');
  }

  backreport() {
    this.leftPanelStateService.goToState('new-device-summary')
  }
  parseTotal(value) {
    return parseFloat(value.toString()).toFixed(2)
  }
  ngOnDestroy(): void {
    this.report = null;
    localStorage.removeItem('report');
    $('body').removeClass('qt-bg-white');
    this.sub.unsubscribe();
  }
}
