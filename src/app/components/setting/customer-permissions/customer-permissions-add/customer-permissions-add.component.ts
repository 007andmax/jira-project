import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { UsersService } from 'src/app/services/users/users.service';

@Component({
  selector: 'customer-permissions-add',
  templateUrl: './customer-permissions-add.component.html',
  styleUrls: ['./customer-permissions-add.component.scss']
})
export class CustomerPermissionsAddComponent implements OnInit {
  @ViewChild('addCustomer') addCustomer: NgbDropdown;
  name: string = '';
  constructor(private usersService: UsersService) { }

  ngOnInit() {
  }
  close() {
    this.addCustomer.close();
    this.name = '';
  }
  addRole() {
    console.log("this.name", this.name);
    if (this.name.length > 0) {
      this.usersService.addRole(this.name).subscribe(data => {
        this.close();
      })
    }
  }
}
