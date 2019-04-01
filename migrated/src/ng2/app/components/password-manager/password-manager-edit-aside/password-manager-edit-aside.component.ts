import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import { PasswordManagerService } from "../../../services/password-manager/password-manager.service";

@Component({
  selector: 'app-password-manager-edit-aside',
  templateUrl: './password-manager-edit-aside.component.html',
  styleUrls: ['./password-manager-edit-aside.component.scss']
})
export class PasswordManagerEditAsideComponent implements OnInit {

  public createPasswordRecord: FormGroup;


  constructor(
    private passwordManagerService: PasswordManagerService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.showAddForm();
    this.initForm();
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

  public initForm(){
    this.createPasswordRecord = this.fb.group({
      description: [''],
      client: [''],
      type: [''],
      ssid: [''],
      userName: [''],
      password: [''],
      key: [''],
      link: [''],
      url: [''],
      code: [''],
      userOrDevice: [''],
      ipAdres: [''],
      port: [''],
      expiryDate: ['']

    });
  }

  save() {
    console.log(this.createPasswordRecord);
  }

}
