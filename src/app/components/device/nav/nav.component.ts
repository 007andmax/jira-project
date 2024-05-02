import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonHttpServices } from './../_services/common_http.service';
import { CommonServices } from './../_services/common.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit, OnDestroy {

  appTitle = 'quickHtml';
  currentUser = '';
  currentCompany = '';
  imgUrl = '';
  deviceType = '';
  _id: string = '';
  type: string = '';
  sub: Subscription = new Subscription();
  constructor(public router: Router,
    public companiesStateService: CompaniesStateService,
    private usersStateService: UsersStateService,
    public commonServices: CommonServices) { }


  ngOnInit() {
    this.type = window.location.href.split('/')[window.location.href.split('/').length - 2];
    this._id = window.location.href.split('/')[window.location.href.split('/').length - 1];
    this.deviceType = this.type;
    // this.deviceType = 'printer';
    if (this.usersStateService.getCurrentUser()) this.getCurrentUser(this.usersStateService.getCurrentUser());
    let getOnGetCurrentuser = this.usersStateService.getOnGetCurrentuser().subscribe(data => {
      this.getCurrentUser(data);
    });
    this.sub.add(getOnGetCurrentuser);
    if (this.companiesStateService.getCurrentCompany()) this.getCurrentCompany(this.companiesStateService.getCurrentCompany());
    let onCurrentCompany = this.companiesStateService.onCurrentCompany.subscribe(data => {
      this.getCurrentCompany(data);
    });
    this.sub.add(onCurrentCompany);
  }

  getCurrentUser(resp) {
    this.currentUser = (resp.firstName + ' ' + resp.lastName).trim();
    localStorage.setItem('currentUser', this.currentUser);
    localStorage.setItem('imId', resp.avatar === null ? '' : resp.avatar.cropped.id);
    this.imgUrl = resp.avatar === null ? '' : `/users/${resp.id}/image.jpg?t=${resp.avatar.updatedAt}`;
  }
  goToDashboard() {
    this.router.navigate(
      [`${this.companiesStateService.getCurrentCompany().techDomain}/device/dashboard/${this.type}/${this._id}`]);
  }
  goToHardware() {
    this.router.navigate(
      [`${this.companiesStateService.getCurrentCompany().techDomain}/device/hardware/${this.type}/${this._id}`]);
  }
  goToSoftware() {
    this.router.navigate(
      [`${this.companiesStateService.getCurrentCompany().techDomain}/device/software/${this.type}/${this._id}`]);
  }
  goToStartProgrames() {
    this.router.navigate(
      [`${this.companiesStateService.getCurrentCompany().techDomain}/device/startup/${this.type}/${this._id}`]);
  }
  goToServices() {
    this.router.navigate(
      [`${this.companiesStateService.getCurrentCompany().techDomain}/device/service/${this.type}/${this._id}`]);
  }
  goToAntivirus() {
    this.router.navigate(
      [`${this.companiesStateService.getCurrentCompany().techDomain}/device/antivirus/${this.type}/${this._id}`]);
  }
  goToTerminal() {
    this.router.navigate(
      [`${this.companiesStateService.getCurrentCompany().techDomain}/device/terminal/${this.type}/${this._id}`]);
  }
  goToWindowUpdates() {
    this.router.navigate(
      [`${this.companiesStateService.getCurrentCompany().techDomain}/device/windows/${this.type}/${this._id}`]);
  }
  goToProcesses() {
    this.router.navigate(
      [`${this.companiesStateService.getCurrentCompany().techDomain}/device/processes/${this.type}/${this._id}`]);
  }
  getCurrentCompany(resp) {
    this.currentCompany = resp.name;
    localStorage.setItem('currentCompanyName', this.currentCompany);
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
