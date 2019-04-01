import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { ApiPasswordManagerService } from "../api-password-manager.service";
import { PasswordManagerService } from "../../../services/password-manager/password-manager.service";

@Component({
  selector: 'app-password-manager-table',
  templateUrl: './password-manager-table.component.html',
  styleUrls: ['./password-manager-table.component.scss']
})
export class PasswordManagerTableComponent implements OnInit, OnChanges {

  @Input() selectedCompany: any;
  @Input() selectedUserOrDevice: any;
  @Input() selectedDate: any;
  @Input() selectedCategory: any;
  public recordsData: any;

  constructor(
    private apiPasswordManagerService: ApiPasswordManagerService,
    private passwordManagerService: PasswordManagerService
  ) { }

  ngOnInit() {
    this.getRecords();
    this.getSelectedCategory();
  }

  ngOnChanges() {
  }

  public getSelectedCategory() {
    this.passwordManagerService.emitSelectedCategory.subscribe((category) => {
      return this.selectedCategory = category;
    });
  }

  getRecords() {
    this.apiPasswordManagerService.getRecords().subscribe((res) => this.recordsData = res);
  }

  editRecord() {
    this.passwordManagerService.addRecord();
  }

}
