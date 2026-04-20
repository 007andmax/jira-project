import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbDropdown, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { UsersService } from 'src/app/services/users/users.service';
import { AppStateService } from 'src/app/states/app/app-state.service';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'customer-permissions-add',
    templateUrl: './customer-permissions-add.component.html',
    styleUrls: ['./customer-permissions-add.component.scss'],
    standalone: true,
    imports: [NgbDropdownModule, FormsModule]
})
export class CustomerPermissionsAddComponent implements OnInit {
  @ViewChild('addCustomer', { static: true }) addCustomer: NgbDropdown;
  name: string = '';
  constructor(private usersService: UsersService,
    private appStateService: AppStateService) { }

  ngOnInit() {
  }
  close() {
    this.addCustomer.close();
    this.name = '';
  }
  addRole() {
    if (this.name.length > 0) {
      this.appStateService.setServerError(true);
      this.usersService.addRole(this.name).subscribe(data => {
        this.appStateService.setServerError(false);
        this.close();
      })
    }
  }
}
