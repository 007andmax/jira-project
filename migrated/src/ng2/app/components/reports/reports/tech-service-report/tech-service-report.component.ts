import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { TechService } from '../../class/tech-service';
import { CurrentUser } from 'src/ng2/class/current-user/current-user';
import { UsersStateService } from 'src/ng2/app/states/users/users-state.service';
import { User } from '../../../users/class/user';
@Component({
  selector: 'app-tech-service-report',
  templateUrl: './tech-service-report.component.html',
  styleUrls: ['./tech-service-report.component.scss']
})
export class TechServiceReportComponent implements OnInit {
  loadingInProgress: boolean = false;
  onInit = false;
  techService: TechService = new TechService();
  techUser:User;
  constructor(private usersStateService:UsersStateService) { }

  ngOnInit() {
  }
  public onRequest(data) {
    this.loadingInProgress = data;
    //  this.cd.detectChanges();
  }
  public getReport(data) {
    console.log("data", data);
   this.techService = data;
   this.techUser = this.usersStateService.getAllUsers().find(item => item.id === this.techService.techUserId);
    this.onInit = true;
    console.log("this.techUser",this.techUser);
  }
  public getDuration(quantity) {
    var timeInMinutes = quantity * 60,
      hours = Math.floor(timeInMinutes / 60),
      minutes = Math.round(timeInMinutes - (hours * 60));
    return `${(hours < 10) ? '0' + hours : hours} : ${(minutes < 10) ? '0' + minutes : minutes}`
  }
  public getDate(date) {
    return moment((date) ? new Date(date) : new Date()).format('DD/MM/YYYY');
  }
}
