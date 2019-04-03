import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { ApiPasswordManagerService } from "../api-password-manager.service";
import { PasswordManagerService } from "../../../services/password-manager/password-manager.service";
import { Subject } from "rxjs";

/**
 * Password manager data table component
 */
@Component({
  selector: 'app-password-manager-table',
  templateUrl: './password-manager-table.component.html',
  styleUrls: ['./password-manager-table.component.scss']
})
export class PasswordManagerTableComponent implements OnInit {

  @Input() selectedCompany: any;
  @Input() selectedUserOrDevice: any;
  @Input() selectedDate: any;
  @Input() selectedCategory: any;
  @Input() addNewRecords: Subject<boolean>;
  public recordsData: any;

  constructor(
    private apiPasswordManagerService: ApiPasswordManagerService,
    private passwordManagerService: PasswordManagerService
  ) { }

  ngOnInit() {
    this.getRecords();
    this.getSelectedCategory();
    this.addNewRecords.subscribe(v => {
      this.getRecords();
    });
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
