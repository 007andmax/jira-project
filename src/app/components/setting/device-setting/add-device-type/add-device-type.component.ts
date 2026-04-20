import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { map } from 'rxjs/operators';
import { AgentService } from 'src/app/services/agent/agent.service';
import { NgClass, NgIf } from '@angular/common';

@Component({
    selector: 'add-device-type',
    templateUrl: './add-device-type.component.html',
    styleUrls: ['./add-device-type.component.scss'],
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule, NgClass, NgIf]
})
export class AddDeviceTypeComponent implements OnInit {
  @Input() techCompany: any;
  deviceForm: UntypedFormGroup;
  submitted = false;
  @Output() onClose = new EventEmitter();
  @Output() onAdded = new EventEmitter();
  constructor(private formBuilder: UntypedFormBuilder,
    private agentService: AgentService,) { }

  ngOnInit() {
    this.deviceForm = this.formBuilder.group({
      Name: [
        "",
        [Validators.required, Validators.minLength(2), Validators.maxLength(30)]
      ],
      TechCompanyGuid: [""],
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
