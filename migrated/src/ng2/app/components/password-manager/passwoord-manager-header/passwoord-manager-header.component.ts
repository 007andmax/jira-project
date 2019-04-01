import { Component, OnInit } from '@angular/core';

import { PasswordManagerService } from "../../../services/password-manager/password-manager.service";

@Component({
  selector: 'app-passwoord-manager-header',
  templateUrl: './passwoord-manager-header.component.html',
  styleUrls: ['./passwoord-manager-header.component.scss']
})
export class PasswoordManagerHeaderComponent implements OnInit {

  constructor(
    private passwordManagerService: PasswordManagerService
  ) { }

  ngOnInit() {
  }

  addRecord() {
    this.passwordManagerService.addRecord();
  }

}
