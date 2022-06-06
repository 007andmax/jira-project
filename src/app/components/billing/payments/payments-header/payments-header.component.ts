import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
import { AppService } from 'src/app/states/app/app.service';
import { PaymentsFilterComponent } from './payments-filter/payments-filter.component';

@Component({
  selector: 'app-payments-header',
  templateUrl: './payments-header.component.html',
  styleUrls: ['./payments-header.component.scss']
})
export class PaymentsHeaderComponent implements OnInit {

  @ViewChild('filter') filter: PaymentsFilterComponent;
  countFilter: number = 0;
  toggleFilter: boolean = false;
  @Output() onCreatePayment = new EventEmitter<any>();
  @Output() onSortBy = new EventEmitter<any>();
  constructor(private permissionsService: PermissionsService,
    public appService: AppService) { }

  ngOnInit() {
    if (this.appService.checkMobile()) this.toggleFilter = true;
  }
  sortBy(data) {
    this.onSortBy.emit(data);
  }
  clearAll() {
    this.filter.onClearAll();
  }
  onChangeCountFilter(data) {
    this.countFilter = data;
  }
  onShowCreatePayment() {
    this.onCreatePayment.emit(null);
  }
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }
}
