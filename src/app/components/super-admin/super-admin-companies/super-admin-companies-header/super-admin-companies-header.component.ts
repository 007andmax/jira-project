import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
    selector: 'super-admin-companies-header',
    templateUrl: './super-admin-companies-header.component.html',
    styleUrls: ['./super-admin-companies-header.component.scss'],
    standalone: true
})
export class SuperAdminCompaniesHeaderComponent implements OnInit {
  @Output() onChangeFilterField = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }
  onFilter(data) {
    this.onChangeFilterField.emit(data);
  }
}
