import { Component, Input, OnInit } from '@angular/core';
import { UserProfile } from '../../users/class/user-profile';

@Component({
  selector: 'app-users-details-tab-companies',
  templateUrl: './users-details-tab-companies.component.html',
  styleUrls: ['./users-details-tab-companies.component.scss']
})
export class UsersDetailsTabCompaniesComponent implements OnInit {
  @Input() user: UserProfile = new UserProfile();
  constructor() { }

  ngOnInit() {
  }

}
