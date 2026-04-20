import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { map } from 'rxjs/operators';
import { AgentService } from 'src/app/services/agent/agent.service';
import { NgClass, NgIf } from '@angular/common';

@Component({
    selector: 'add-manufacture',
    templateUrl: './add-manufacture.component.html',
    styleUrls: ['./add-manufacture.component.scss'],
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule, NgClass, NgIf]
})
export class AddManufactureComponent implements OnInit {
  @Input() techCompany: any;
  @Output() onClose = new EventEmitter();
  @Output() onAdded = new EventEmitter();
  manufactureForm: UntypedFormGroup;
  submitted: boolean = false;
  constructor(private formBuilder: UntypedFormBuilder,
    private agentService: AgentService,) { }

  ngOnInit() {
    this.manufactureForm = this.formBuilder.group({
      Name: [
        "",
        [Validators.required, Validators.minLength(2), Validators.maxLength(30)]
      ],
      TechCompanyGuid: [""],
    })
    this.manufactureForm.patchValue({
      TechCompanyGuid: this.techCompany.id,
    });
  }
  onSubmitManufacturer() {
    this.submitted = true;

    // add
    this.agentService.addManufacturer(this.manufactureForm.value)
      .pipe(
        map((res: any) => {
          this.onAdded.emit(res);
          // this.manufacturerList.push(res);
        })
      )
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
