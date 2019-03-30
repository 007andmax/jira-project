import { Component, Input, OnInit } from '@angular/core';
import { ApiPasswordManagerService } from "../api-password-manager.service";

@Component({
  selector: 'app-password-manager-table',
  templateUrl: './password-manager-table.component.html',
  styleUrls: ['./password-manager-table.component.scss']
})
export class PasswordManagerTableComponent implements OnInit {

  @Input() filter: any;
  @Input() selectedUserOrDevice: any;
  public recordsData: any;

  constructor(
    private apiPasswordManagerService: ApiPasswordManagerService,
  ) { }

  ngOnInit() {
    this.getRecords();
  }

  getRecords() {
    this.apiPasswordManagerService.getRecords().subscribe((res) => this.recordsData = res);
  }

}
