import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map } from 'rxjs/operators';
import { AgentService } from 'src/app/services/agent/agent.service';
import { DevicesService } from 'src/app/services/devices/devices.service';

@Component({
  selector: 'app-device-setting-manufactures-add',
  templateUrl: './device-setting-manufactures-add.component.html',
  styleUrls: ['./device-setting-manufactures-add.component.scss']
})
export class DeviceSettingManufacturesAddComponent implements OnInit {
  @Output() onClose = new EventEmitter();
  manufactureForm: FormGroup;
  submitted: boolean = false;
  constructor(private formBuilder: FormBuilder,
    private devicesService: DevicesService) { }

  ngOnInit() {
    this.manufactureForm = this.formBuilder.group({
      name: [
        "",
        [Validators.required, Validators.minLength(1), Validators.maxLength(30)]
      ],
    })
  }
  onSubmitManufacturer() {
    this.submitted = true;

    // add
    this.devicesService.addManufacture({ "manufacturer": this.manufactureForm.value.name })
      .subscribe(
        () => {
          //this.getManufacturers(this.techCompany.id)
          this.closed();
        });
  }
  get f1() {
    return this.manufactureForm.controls;
  }
  closed() {
    this.onClose.emit();
  }

}
