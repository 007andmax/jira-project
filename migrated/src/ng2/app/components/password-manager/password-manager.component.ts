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
  ) {
    console.log('123251235123512351235');
  }

  ngOnInit() {
    console.log('testes');
    console.log('123512351');
    this.recordsData = this.getRecords();
  };


  getRecords() {
    console.log('test');
    return this.apiPasswordManagerService.getRecords()
  }

}
