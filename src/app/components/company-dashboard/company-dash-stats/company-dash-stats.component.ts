import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { CompanyProfile } from '../../companies/class/company-profile';
import { CompanyPrimaryContact } from '../../companies/class/company-primary-contact';
import { Subscription } from 'rxjs';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { DevicesStateService } from 'src/app/states/devices/devices-state.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-company-dash-stats',
  templateUrl: './company-dash-stats.component.html',
  styleUrls: ['./company-dash-stats.component.scss']
})
export class CompanyDashStatsComponent implements OnInit {

  public companyDetail: CompanyProfile;
  _id: string = '';
  primaryContact: CompanyPrimaryContact = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    avatar: ''
  };
  mapSrc: string = '';
  companyOpen: string = 'Close';
  workingDays = [];
  closingSoon: boolean = false;
  tagSaved: boolean = false;
  sub: Subscription = new Subscription();
  tags = [];
  closeResult: string = '';
  modalReference: any;
  @Input() totalTickets: number = 0;
  @Input() averageResponseTime: number = 0;


  showArchivedCompanies: boolean = false;
  public countUsers: number = 0;
  public countDevices: number = 0;

  public constructor(
    private usersStateService: UsersStateService,
    private devicesState: DevicesStateService,
    public activateRoute: ActivatedRoute,
    public cd: ChangeDetectorRef
  ) { }

  public ngOnInit() {
    this._id = this.activateRoute.snapshot.params['id'];
    let subscription = this.activateRoute.params.subscribe(params => {
      this._id = params['id'];
      if (this.usersStateService.getAllUsers().length > 0) this.onGetUsersCount(this.usersStateService.getAllUsers());
      if (this.devicesState.getAllDevices()) this.onGetDevicesCount(this.devicesState.getAllDevices());
    });
    this.sub.add(subscription);
    if (this.usersStateService.getAllUsers().length > 0) this.onGetUsersCount(this.usersStateService.getAllUsers());
    let getOnUsers = this.usersStateService.getOnUsers().subscribe((data) => {
      this.showArchivedCompanies = false;
      this.onGetUsersCount(data);
    })
    this.sub.add(getOnUsers);
    if (this.devicesState.getAllDevices()) this.onGetDevicesCount(this.devicesState.getAllDevices());
    let getOnDevices = this.devicesState.getOnDevices().subscribe((data) => {
      this.showArchivedCompanies = false;
      this.onGetDevicesCount(data);
    })
    this.sub.add(getOnDevices);
  }

  private onGetUsersCount(data) {
    let users = data;
    this.countUsers = users.filter((user) => {
      var isArchived = user.deletedAt;
      return !isArchived && !this.showArchivedCompanies && user.company.id === this._id || this.showArchivedCompanies && isArchived && user.company.id === this._id;
    }).length;
    if (!this.cd['destroyed']) {
      this.cd.detectChanges();
    }
  }

  private onGetDevicesCount(data) {
    let devices = data;
    this.countDevices = (devices && devices[this._id]) ? devices[this._id].length : 0;
    if (!this.cd['destroyed']) {
      this.cd.detectChanges();
    }
  }



}
