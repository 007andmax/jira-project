import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map } from 'rxjs/operators';
import { AgentService } from 'src/app/services/agent/agent.service';

@Component({
  selector: 'add-model',
  templateUrl: './add-model.component.html',
  styleUrls: ['./add-model.component.scss']
})
export class AddModelComponent implements OnInit {
  @Input() manufactureId: string;
  modelForm: FormGroup;
  submitted: boolean = false;
  @Output() onClose = new EventEmitter();
  @Output() onAdded = new EventEmitter();
  constructor(private formBuilder: FormBuilder,
    private agentService: AgentService) { }

  ngOnInit() {
    this.modelForm = this.formBuilder.group({
      Name: [
        "",
        [Validators.required, Validators.minLength(2), Validators.maxLength(30)]
      ],
      ID: [""],
      ManufacturerID: [""],
      ManufactureName: [""],
      IsActive: [""],
      CreateDate: [""]
    })
    this.modelForm.patchValue({
      ManufacturerID: this.manufactureId,
    });
  }
  onSubmitModel() {
    this.submitted = true;
    this.agentService.addModel(this.modelForm.value)
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
  get f2() {
    return this.modelForm.controls;
  }
  closed() {
    this.onClose.emit();
  }
}
