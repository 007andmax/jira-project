import { Component, OnInit } from '@angular/core';
import { CommonHttpServices } from './../_services/common_http.service';
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
  constructor(private commonHttpServices: CommonHttpServices,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.getCurrentUser();
    this.getCurrentCompany();
  } 

  getCurrentUser() {
	
    this.commonHttpServices.getCurrentUser()
    .pipe(first())
    .subscribe(
      resp => {
        
        this.currentUser = (resp.firstName + ' ' + resp.lastName).trim();
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
        localStorage.setItem('currentCompany', resp.id);
      },
      error => {
      this.toastr.error('Something went wrong please try again.');
      }
    );
  }

}
