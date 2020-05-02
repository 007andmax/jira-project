import { Component, OnInit } from '@angular/core';
import { CommonHttpServices } from './../_services/common_http.service';
import { CommonServices } from './../_services/common.service';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';

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
  constructor(private commonHttpServices: CommonHttpServices,
    private toastr: ToastrService,
    public commonServices: CommonServices) { }

  ngOnInit() {
    this.deviceType = localStorage.getItem('type');
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
        this.imgUrl = `/users/${resp.id}/image.jpg?t=${resp.avatar.updatedAt}`;
      },
      error => {
      this.toastr.error('Something went wrong please try again.');
      }
    );
  }

  getCurrentCompany() {
	
    this.commonHttpServices.getCurrentCompany()
    .pipe(first())
    .subscribe(
      resp => {
        this.currentCompany = resp.name;
        localStorage.setItem('currentCompanyName', this.currentCompany);
        localStorage.setItem('currentCompany', resp.id);
      },
      error => {
      this.toastr.error('Something went wrong please try again.');
      }
    );
  }

}
