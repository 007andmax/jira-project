import { Component, Input, OnInit } from '@angular/core';
import { UserProfile } from '../../users/class/user-profile';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { UsersService } from 'src/app/services/users/users.service';

@Component({
  selector: 'app-users-details-tab-companies',
  templateUrl: './users-details-tab-companies.component.html',
  styleUrls: ['./users-details-tab-companies.component.scss']
})
export class UsersDetailsTabCompaniesComponent implements OnInit {
  @Input() user: UserProfile = new UserProfile();
  constructor(public usersStateService: UsersStateService,
    private usersService: UsersService,
  ) { }

  ngOnInit() {

  }
  updateUser() {
    this.usersService.updateUser(this.user.getUserForUpdate(this.usersStateService.getuserForEdit())).subscribe(data => {

    })
  }
}
