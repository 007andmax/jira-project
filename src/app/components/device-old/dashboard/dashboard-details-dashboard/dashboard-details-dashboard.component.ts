
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { HardwareService } from 'src/app/components/device/_services/hardware.service';
import { FORMAT_DATE_2 } from 'src/app/const/date-picker';
import { DatePickerComponent } from 'src/app/components/shared/date-picker/date-picker.component';

@Component({
  standalone: true,
  imports: [DatePickerComponent, FormsModule, CommonModule],
  selector: 'dashboard-details-dashboard',
  templateUrl: './dashboard-details-dashboard.component.html',
  styleUrls: ['./dashboard-details-dashboard.component.scss'],

})
export class DashboardDetailsDashboardComponent implements OnInit {
  @Input() label = '';
  @Input() hostName = '';
  @Input() system;
  @Input() networkAdapters = {
    ipAddress: ''
  };
  @Input() _id = '';
  @Input() windows_info: string = '';
  formatDate: string = FORMAT_DATE_2;
  @Output() onChangeInstallDate: EventEmitter<any> = new EventEmitter();
  @Output() onChangeWarranty: EventEmitter<any> = new EventEmitter();
  @Output() onUpdateDashboard: EventEmitter<any> = new EventEmitter();
  constructor(private hardwareService: HardwareService,
    private toastr: ToastrService) { }

  ngOnInit() {

  }
  saveLabel() {
    this.label = this.label.toUpperCase();
    const data = {
      agentId: this._id,
      companyId: localStorage.getItem('company_id'),
      newLabelValue: this.label
    }
    this.hardwareService.saveDeviceName(data)
      .pipe(first())
      .subscribe(
        resp => {
          $('#head-label').text(this.label);
          let obj = JSON.parse(localStorage.getItem('deviceDetail_' + this._id));
          obj.label = this.label;
          localStorage.setItem('deviceDetail_' + this._id, JSON.stringify(obj));
        },
        error => {
          this.toastr.error('Something went wrong please try again.');
        }
      );
  }
  changeInstallDate(data) {
    this.onChangeInstallDate.emit(data);
  }
  changeWarranty(data) {
    this.onChangeWarranty.emit(data);
  }
  updateDashboard(data) {
    this.onUpdateDashboard.emit(data);
  }
}
