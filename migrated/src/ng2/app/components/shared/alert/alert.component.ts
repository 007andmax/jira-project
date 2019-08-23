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
  constructor(private alertState: AlertStateService,
    public cd: ChangeDetectorRef, ) { }

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
