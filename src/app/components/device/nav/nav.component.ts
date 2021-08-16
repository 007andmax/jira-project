import { Component, OnInit } from '@angular/core';
import { CommonHttpServices } from './../_services/common_http.service';
import { CommonServices } from './../_services/common.service';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  appTitle = 'quickHtml';
  currentUser = '';
  currentCompany = '';
  imgUrl = '';
  deviceType = '';
  _id: string = '';
  type: string = '';
  constructor(private commonHttpServices: CommonHttpServices,
    private toastr: ToastrService,
    public router: Router,
    public companiesStateService: CompaniesStateService,
    public commonServices: CommonServices) { }

  ngOnInit() {
    this.type = window.location.href.split('/')[window.location.href.split('/').length - 2];
    this._id = window.location.href.split('/')[window.location.href.split('/').length - 1];
    this.deviceType = this.type;
    // this.deviceType = 'printer';
    this.getCurrentUser();
    this.getCurrentCompany();
  }

  getCurrentUser() {

    this.commonHttpServices.getCurrentUser()
      .pipe(first())
      .subscribe(
        resp => {

          this.currentUser = (resp.firstName + ' ' + resp.lastName).trim();
          localStorage.setItem('currentUser', this.currentUser);
          localStorage.setItem('imId', resp.avatar === null ? '' : resp.avatar.cropped.id);
          this.imgUrl = resp.avatar === null ? '' : `/users/${resp.id}/image.jpg?t=${resp.avatar.updatedAt}`;
        },
        error => {
          this.toastr.error('Something went wrong please try again.');
        }
      );
  }
  goToDashboard() {
    this.router.navigate(
      [`${this.companiesStateService.getCurrentCompany().name.replaceAll(' ', '')}/device/dashboard/${this.type}/${this._id}`]);
  }
  goToHardware() {
    this.router.navigate(
      [`${this.companiesStateService.getCurrentCompany().name.replaceAll(' ', '')}/device/hardware/${this.type}/${this._id}`]);
  }
  goToSoftware() {
    this.router.navigate(
      [`${this.companiesStateService.getCurrentCompany().name.replaceAll(' ', '')}/device/software/${this.type}/${this._id}`]);
  }
  goToStartProgrames(){
    this.router.navigate(
      [`${this.companiesStateService.getCurrentCompany().name.replaceAll(' ', '')}/device/startup/${this.type}/${this._id}`]);
  }
  goToServices(){
    this.router.navigate(
      [`${this.companiesStateService.getCurrentCompany().name.replaceAll(' ', '')}/device/service/${this.type}/${this._id}`]);
  }
  goToAntivirus(){
    this.router.navigate(
      [`${this.companiesStateService.getCurrentCompany().name.replaceAll(' ', '')}/device/antivirus/${this.type}/${this._id}`]);
  }
  goToTerminal() {
    this.router.navigate(
      [`${this.companiesStateService.getCurrentCompany().name.replaceAll(' ', '')}/device/terminal/${this.type}/${this._id}`]);
  }
  goToWindowUpdate(){
    this.router.navigate(
      [`${this.companiesStateService.getCurrentCompany().name.replaceAll(' ', '')}/device/window/${this.type}/${this._id}`]);
  }
  goToFileExplorer(){
    this.router.navigate(
      [`${this.companiesStateService.getCurrentCompany().name.replaceAll(' ', '')}/device/file/${this.type}/${this._id}`]);
  }
  goToPasswords(){
    this.router.navigate(
      [`${this.companiesStateService.getCurrentCompany().name.replaceAll(' ', '')}/device/password/${this.type}/${this._id}`]);
  }
  getCurrentCompany() {

    this.commonHttpServices.getCurrentCompany()
      .pipe(first())
      .subscribe(
        resp => {
          this.currentCompany = resp.name;
          localStorage.setItem('currentCompanyName', this.currentCompany);
        },
        error => {
          this.toastr.error('Something went wrong please try again.');
        }
      );
  }

}
