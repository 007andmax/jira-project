import { Component, OnInit } from '@angular/core';
import { ApiPasswordManagerService } from "./api-password-manager.service";

@Component({
  selector: 'app-password-manager',
  templateUrl: './password-manager.component.html',
  styleUrls: ['./password-manager.component.scss']
})
export class PasswordManagerComponent implements OnInit {

  public recordsData :any;

  constructor(
    private apiPasswordManagerService: ApiPasswordManagerService
  ) {}

  ngOnInit() {
    this.getRecords()
  };

  getRecords() {
    this.recordsData =  this.apiPasswordManagerService.getRecords().pipe((res) => res);
  }

}
