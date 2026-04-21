import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonServices } from './../_services/common.service';
import { Router } from '@angular/router';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { User } from '../../users/class/user';
import { Company } from 'src/app/interfaces/company/company';
import { Subscription } from 'rxjs';

@Component({
  standalone: true,
  imports: [CommonModule],
    selector: 'nav-old',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.scss'],
    standalone: true
})
export class NavOldComponent implements OnInit, OnDestroy {

  appTitle = 'quickHtml';
  currentUser: User;
  currentCompany: Company;
  deviceType = '';
  _id: string = '';
  type: string = '';
  sub: Subscription = new Subscription();
  constructor(
    public router: Router,
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
      this.getCurrentUser(data)
    })
    this.sub.add(getOnGetCurrentuser);
    if (this.companiesStateService.getCurrentCompany()) this.getCurrentCompany(this.companiesStateService.getCurrentCompany());
    let getOnCurrentCompany = this.companiesStateService.getOnCurrentCompany().subscribe(data => {
      this.getCurrentCompany(this.companiesStateService.getCurrentCompany());
    })
    this.sub.add(getOnCurrentCompany);
  }
  private getCurrentUser(data) {
    this.currentUser = data;
    localStorage.setItem('imId', this.currentUser.avatar === null ? '' : this.currentUser.avatar.cropped.id);
  }
  goToSoftware() {
    this.router.navigate(
      [`${this.companiesStateService.getCurrentCompany().name.replaceAll(' ', '')}/device-old/software/${this.type}/${this._id}`]);
  }
  getCurrentCompany(data) {
    this.currentCompany = data;
    localStorage.setItem('currentCompanyName', this.currentCompany.name);
  }
  checkLogo() {
    if (this.currentUser && this.currentUser.avatar) return `/users/${this.currentUser.id}/image.jpg?t=${this.currentUser.avatar.updatedAt}`;
    return null;
  }
  public getCurrentUserName() {
    let user = this.usersStateService.getCurrentUser();
    return (user) ? `${user.firstName} ${user.lastName}` : '';
  }
  goToHardware() {
    this.router.navigate(
      [`${this.companiesStateService.getCurrentCompany().name.replaceAll(' ', '')}/device-old/hardware/${this.type}/${this._id}`]);
  }
  goToDashboard() {
    this.router.navigate(
      [`${this.companiesStateService.getCurrentCompany().name.replaceAll(' ', '')}/device-old/dashboard/${this.type}/${this._id}`]);
  }
  goToTerminal() {
    this.router.navigate(
      [`${this.companiesStateService.getCurrentCompany().name.replaceAll(' ', '')}/device-old/terminal/${this.type}/${this._id}`]);
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
