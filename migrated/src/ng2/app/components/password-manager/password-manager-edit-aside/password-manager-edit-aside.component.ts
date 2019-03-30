import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-password-manager-edit-aside',
  templateUrl: './password-manager-edit-aside.component.html',
  styleUrls: ['./password-manager-edit-aside.component.scss']
})
export class PasswordManagerEditAsideComponent implements OnInit {


  constructor() { }

  ngOnInit() {
  }

  private _opened: boolean = false;

  private _toggleSidebar() {
    this._opened = !this._opened;
  }

}
