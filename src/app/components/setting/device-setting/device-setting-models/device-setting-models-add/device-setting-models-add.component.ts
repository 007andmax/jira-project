import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ManufactureDevice } from 'src/app/components/company-devices/company-devices-custom-aside/class/manufacture-device';
import { ModelDevice } from 'src/app/components/company-devices/company-devices-custom-aside/class/model-device';
import { DevicesService } from 'src/app/services/devices/devices.service';
import { DevicesStateService } from 'src/app/states/devices/devices-state.service';

@Component({
  selector: 'app-device-setting-models-add',
  templateUrl: './device-setting-models-add.component.html',
  styleUrls: ['./device-setting-models-add.component.scss']
})
export class DeviceSettingModelsAddComponent implements OnInit {
  @Input() manufactureId: string;
  modelForm: FormGroup;
  submitted: boolean = false;
  manufactures: Array<ManufactureDevice> = [];
  models: Array<ModelDevice> = [];
  @Output() onClose = new EventEmitter();
  constructor(private devicesStateService: DevicesStateService,
    private formBuilder: FormBuilder,
    private devicesService: DevicesService,) { }

  ngOnInit() {
    if (this.devicesStateService.getManufactures().length > 0) {
      this.manufactures = this.devicesStateService.getManufactures();

    }
    if (this.devicesStateService.getManufactures().length == 0) this.devicesStateService.initGetManufactures();
    this.devicesStateService.onGetManufactures.subscribe(data => {
      this.manufactures = data;
    })
    this.modelForm = this.formBuilder.group({
      model: [
        "",
        [Validators.required, Validators.minLength(1), Validators.maxLength(255)]
      ],
      manufacturerId: [""],
    })
    this.modelForm.patchValue({
      manufacturerId: this.manufactureId,
    });
    this.devicesService.getModels(this.manufactureId).subscribe((res: any) => {
      this.models = res.models.map(item => new ModelDevice(item))
    })
  }
  onSubmitModel() {
    this.submitted = true;
    if (this.modelForm.invalid) {
      return;
    }
    this.devicesService.addModel(this.modelForm.value)
      .subscribe(
        () => {
          this.closed();
        });
  }
  get f2() {
    return this.modelForm.controls;
  }
  closed() {
    this.onClose.emit();
  }
}
