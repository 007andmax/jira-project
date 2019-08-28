import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AlertStateService } from './services/alert-state.service';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {
  message: string = '';
  show: boolean = false;

  /**
   * Creates an instance of the AlertComponent with the injected services
   * @param {AlertStateService} alertState to work alert state
   * @param {ChangeDetectorRef} cdRef Service to work with date
   */
  constructor(private alertState: AlertStateService,
    public cd: ChangeDetectorRef, ) { }

     /**
   * Initializes alert. See [ngOnInit]{@see OnInit#ngOnInit}
   */
  ngOnInit() {
    this.alertState.getShowAlert().subscribe((message) => {
      this.message = message;
      this.show = true;
      this.cd.detectChanges();
      setTimeout(() => {
        this.show = false;
        this.cd.detectChanges();
      }, 2000);
    })
  }

}
