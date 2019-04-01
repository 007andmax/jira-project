import { Component, OnInit } from '@angular/core';

import { PasswordManagerService } from "../../../services/password-manager/password-manager.service";

@Component({
  selector: 'app-password-manager-edit-aside',
  templateUrl: './password-manager-edit-aside.component.html',
  styleUrls: ['./password-manager-edit-aside.component.scss']
})
export class PasswordManagerEditAsideComponent implements OnInit {


  constructor(
    private passwordManagerService: PasswordManagerService
  ) { }

  ngOnInit() {
    this.showAddForm();
  }

  public _opened: boolean = false;

  public _toggleSidebar() {
    this._opened = !this._opened;
  }

  public showAddForm() {
    this.passwordManagerService.showAddForm.subscribe((res) => {
      console.log('test');
      this._opened = true;
    })

  }

}
