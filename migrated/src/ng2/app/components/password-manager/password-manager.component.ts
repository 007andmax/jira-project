import { Component, OnInit } from '@angular/core';
import { ApiPasswordManagerService } from "./api-password-manager.service";

@Component({
  selector: 'app-password-manager',
  templateUrl: './password-manager.component.html',
  styleUrls: ['./password-manager.component.scss']
})
export class PasswordManagerComponent implements OnInit {

  constructor(
    private apiPasswordManagerService: ApiPasswordManagerService
  ) { }

  ngOnInit() {
    console.log('testes');
    console.log('123512351');

    this.apiPasswordManagerService.getRecords().subscribe((res) => {
      console.log(res);
    })
  };

}
