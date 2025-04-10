import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { map } from 'rxjs/operators';
import { AgentService } from 'src/app/services/agent/agent.service';
import { DevicesService } from 'src/app/services/devices/devices.service';

@Component({
  selector: 'app-add-device-setting-type',
  templateUrl: './add-device-setting-type.component.html',
  styleUrls: ['./add-device-setting-type.component.scss']
})
export class AddDeviceSettingTypeComponent implements OnInit {
  deviceForm: FormGroup;
  submitted = false;
  @Output() onClose = new EventEmitter();
  @Output() onAdded = new EventEmitter();
  constructor(private formBuilder: FormBuilder,
    private devicesService: DevicesService,) { }

  ngOnInit() {
    this.deviceForm = this.formBuilder.group({
      name: [
        "",
        [Validators.required, Validators.minLength(1), Validators.maxLength(255)]
      ],
    });
  }
  onSubmit() {
    this.submitted = true;
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
