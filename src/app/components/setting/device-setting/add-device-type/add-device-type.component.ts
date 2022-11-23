import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map } from 'rxjs/operators';
import { AgentService } from 'src/app/services/agent/agent.service';

@Component({
  selector: 'add-device-type',
  templateUrl: './add-device-type.component.html',
  styleUrls: ['./add-device-type.component.scss']
})
export class AddDeviceTypeComponent implements OnInit {
  @Input() techCompany: any;
  deviceForm: FormGroup;
  submitted = false;
  @Output() onClose = new EventEmitter();
  @Output() onAdded = new EventEmitter();
  constructor(private formBuilder: FormBuilder,
    private agentService: AgentService,) { }

  ngOnInit() {
    this.deviceForm = this.formBuilder.group({
      Name: [
        "",
        [Validators.required, Validators.minLength(2), Validators.maxLength(30)]
      ],
      ID: [""],
      TechCompanyID: [""],
      TechCompanyGuid: [""],
      Counter: [""]

    });
    this.deviceForm.patchValue({
      TechCompanyGuid: this.techCompany.id,
    });
  }
  onSubmit() {
    this.submitted = true;
    this.agentService.addHardwareType(this.deviceForm.value)
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
