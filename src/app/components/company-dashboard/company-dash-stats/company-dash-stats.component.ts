import { Component, OnInit, Input, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CompanyProfile } from '../../companies/class/company-profile';
import { CompanyPrimaryContact } from '../../companies/class/company-primary-contact';
import { Subscription } from 'rxjs';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { DevicesStateService } from 'src/app/states/devices/devices-state.service';
import { ActivatedRoute } from '@angular/router';
import { DevicesService } from 'src/app/services/devices/devices.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-company-dash-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './company-dash-stats.component.html',
  styleUrls: ['./company-dash-stats.component.scss']
})
export class CompanyDashStatsComponent implements OnInit, OnDestroy {

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
    private devicesService: DevicesService,
    public cd: ChangeDetectorRef,
  ) { }


  public ngOnInit() {
    this._id = this.activateRoute.snapshot.params['id'];
    let subscription = this.activateRoute.params.subscribe(params => {
      this._id = params['id'];
      this.getDeviceCount(this._id);
      if (this.usersStateService.getAllUsers().length > 0) this.onGetUsersCount(this.usersStateService.getAllUsers());
    });
    this.sub.add(subscription);
    if (this.usersStateService.getAllUsers().length > 0) this.onGetUsersCount(this.usersStateService.getAllUsers());
    let getOnUsers = this.usersStateService.getOnUsers().subscribe((data) => {
      this.showArchivedCompanies = false;
      this.onGetUsersCount(data);
    })
    this.sub.add(getOnUsers);
    let onChangeUsers = this.usersStateService.onChangeUsers.subscribe((data) => {
      this.showArchivedCompanies = false;
      this.onGetUsersCount(this.usersStateService.getAllUsers());
    })
    this.sub.add(onChangeUsers);
    let onChangeDeviceCount = this.devicesState.onChangeDeviceCount.subscribe(data => {
      if (this._id == data.data.companyId) this.countDevices = data.data.count;
    });
    this.sub.add(onChangeDeviceCount);
  }
  getDeviceCount(id) {
    this.devicesService.getCountByCompany([id]).subscribe(data => {
      this.countDevices = data[0].count;
    })
  }
  private onGetUsersCount(data) {
    let users = data;
    this.countUsers = users.filter((user) => {
      var isArchived = user.deletedAt;
      return !isArchived && !this.showArchivedCompanies && user.customerCompaniesInfo.find(clientCompany => clientCompany.companyId === this._id) || this.showArchivedCompanies && isArchived && user.customerCompaniesInfo.find(clientCompany => clientCompany.companyId === this._id);
    }).length;
    if (!this.cd['destroyed']) {
      this.cd.detectChanges();
    }
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
