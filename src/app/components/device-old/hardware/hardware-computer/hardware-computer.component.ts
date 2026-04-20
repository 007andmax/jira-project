import { Component, Input, OnInit } from '@angular/core';
import { System } from '../class/system';
import { HardwareService } from '../../_services/hardware.service';
import { first } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'hardware-computer',
    templateUrl: './hardware-computer.component.html',
    styleUrls: ['./hardware-computer.component.scss'],
    standalone: true,
    imports: [FormsModule, NgIf]
})
export class HardwareComputerComponent implements OnInit {
  @Input() system: System;
  @Input() deviceName: string = '';
  @Input() _id: string = '';
  constructor(private hardwareService: HardwareService,
    private toastr: ToastrService) { }

  ngOnInit() {
  }
  saveLabel() {
    this.deviceName = this.deviceName.toUpperCase();
    const data = {
      agentId: this._id,
      companyId: localStorage.getItem('company_id'),
      newLabelValue: this.deviceName
    }
    this.hardwareService.saveDeviceName(data)
      .pipe(first())
      .subscribe(
        resp => {
          $('#head-label').text(this.deviceName);
          let obj = JSON.parse(localStorage.getItem('deviceDetail_' + this._id));
          obj.label = this.deviceName;
          localStorage.setItem('deviceDetail_' + this._id, JSON.stringify(obj));
        },
        error => {
          this.toastr.error('Something went wrong please try again.');
        }
      );
  }
}
