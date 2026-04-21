import { ReportMenuComponent } from './';
import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import * as moment from 'moment';
import { TechService } from '../../class/tech-service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { User } from '../../../users/class/user';

@Component({
  standalone: true,
  imports: [ReportMenuComponent, CommonModule],
    selector: 'app-tech-service-report',
    templateUrl: './tech-service-report.component.html',
    styleUrls: ['./tech-service-report.component.scss'],
    standalone: true
})
export class TechServiceReportComponent implements OnInit {
  loadingInProgress: boolean = false;
  onInit = false;
  techService: TechService = new TechService();
  techUser: User;
  constructor(private usersStateService: UsersStateService,
    public cd: ChangeDetectorRef) { }

  ngOnInit() {
  }
  public onRequest(data) {
    this.loadingInProgress = data;
    this.cd.detectChanges();
  }
  public getUserName(user) {
    return `${user.firstName} ${user.lastName}`;
  }
  public getReport(data) {
    this.techService = new TechService(JSON.parse(JSON.stringify(data)));
    this.techUser = this.usersStateService.getAllUsers().find(item => item.id === this.techService.techUserId);
    this.onInit = true;
  }
  public getDuration(quantity) {
    var timeInMinutes = quantity * 60,
      hours = Math.floor(timeInMinutes / 60),
      minutes = Math.round(timeInMinutes - (hours * 60));
    return `${(hours < 10) ? '0' + hours : hours} : ${(minutes < 10) ? '0' + minutes : minutes}`
  }
  public getDateForHeader(data) {
    return moment(data).format('DD MMM YYYY');
  }
  public getDate(dateInvoice) {
    let date = new Date(dateInvoice);
    return `${moment((date) ? new Date(date) : new Date()).format('DD/MM/YYYY')} ${moment(new Date(date)).format('hh:mm A')}`;
  }
  public trackByIndex(index, item) {
    return index;
  }
}
