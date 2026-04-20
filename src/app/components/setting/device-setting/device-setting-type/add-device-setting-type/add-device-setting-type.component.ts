import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { map } from 'rxjs/operators';
import { DeviceType } from 'src/app/components/company-devices/class/device-type';
import { AgentService } from 'src/app/services/agent/agent.service';
import { DevicesService } from 'src/app/services/devices/devices.service';
import { DevicesStateService } from 'src/app/states/devices/devices-state.service';
import { NgClass, NgIf } from '@angular/common';

@Component({
    selector: 'app-add-device-setting-type',
    templateUrl: './add-device-setting-type.component.html',
    styleUrls: ['./add-device-setting-type.component.scss'],
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule, NgClass, NgIf]
})
export class AddDeviceSettingTypeComponent implements OnInit {
  deviceForm: UntypedFormGroup;
  submitted = false;
  deviceTypes: Array<DeviceType> = [];
  disableCreate: boolean = false;
  @Output() onClose = new EventEmitter();
  @Output() onAdded = new EventEmitter();
  constructor(private formBuilder: UntypedFormBuilder,
    private devicesStateService: DevicesStateService,
    private devicesService: DevicesService,) { }

  ngOnInit() {
    this.deviceTypes = this.devicesStateService.getDeviceTypes();
    this.deviceForm = this.formBuilder.group({
      name: [
        "",
        [Validators.required, Validators.minLength(1), Validators.maxLength(255)]
      ],
    });
  }
  checkDublicate() {
    var duplicateCategory = this.deviceTypes.filter((item) => {
      return item.name.toLowerCase() == this.deviceForm.value.name.toLowerCase();
    });
    if (duplicateCategory && duplicateCategory[0]) {
      this.disableCreate = true;
    } else {
      this.disableCreate = false;
    }
  };
  onSubmit() {
    if (this.disableCreate) return;
    this.submitted = true;
    if (this.deviceForm.invalid) {
      return;
    }
    this.devicesService.addDeviceTypes(this.deviceForm.value)
      .pipe(
        map((res: any) => {
          this.onAdded.emit(res);
        })
      )
      .subscribe(
        () => {
          this.closed();
        });
  }
  get f() {
    return this.deviceForm.controls;
  }
  closed() {
    this.onClose.emit();
  }

}
