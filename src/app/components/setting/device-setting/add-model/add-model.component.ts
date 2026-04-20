import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { map } from 'rxjs/operators';
import { AgentService } from 'src/app/services/agent/agent.service';
import { NgIf, NgClass } from '@angular/common';
import { DropDownComponent } from '../../../shared/drop-down/drop-down.component';

@Component({
    selector: 'add-model',
    templateUrl: './add-model.component.html',
    styleUrls: ['./add-model.component.scss'],
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule, DropDownComponent, NgIf, NgClass]
})
export class AddModelComponent implements OnInit {
  manufactureId: string;
  modelForm: UntypedFormGroup;
  submitted: boolean = false;
  manufactureIsActiveList: any[] = [];
  @Input() techCompany: any;
  @Output() onClose = new EventEmitter();
  @Output() onAdded = new EventEmitter();
  constructor(private formBuilder: UntypedFormBuilder,
    private agentService: AgentService) { }

  ngOnInit() {
    this.modelForm = this.formBuilder.group({
      Name: [
        "",
        [Validators.required, Validators.minLength(2), Validators.maxLength(30)]
      ],
      ManufacturerID: [""],
    })
    this.modelForm.patchValue({
      ManufacturerID: this.manufactureId,
    });
    this.getManufacturers(this.techCompany.id);
  }
  onSelectManufactureName(SelectManufacturer) {
    if (SelectManufacturer) {
      this.manufactureId = SelectManufacturer.ID;
      this.modelForm.patchValue({
        ManufacturerID: this.manufactureId,
      });
      /* this.agentService.getModelsByManufacturer(SelectManufacturer.ID).subscribe((resp) => {
         this.selectManufactureList = resp;
       })*/
    }
    else {
      this.modelForm.patchValue({
        ManufacturerID: null,
        Name: ""
      });
      // this.getModels(this.techCompany.id);
    }
  }
  getManufacturers(TechCompanyGuid: any) {
    if (this.agentService.AccessToken == '') {
      setTimeout(() => {
        this.getManufacturers(TechCompanyGuid);
      }, 300);
      return;
    }
    this.agentService.getManufactures(TechCompanyGuid)
      .subscribe((resp) => {
        this.manufactureIsActiveList = [];
        resp.forEach(element => {
          if (element.IsActive == true)
            this.manufactureIsActiveList.push(element)
        })
      });
  }
  onSubmitModel() {
    this.submitted = true;
    this.agentService.addModel(this.modelForm.value)
      .pipe(
        map((res: any) => {
          this.onAdded.emit({
            ...this.modelForm.value, IsActive: true,
            ManufactureName: this.manufactureIsActiveList.find(item => item.ID === this.manufactureId).Name,
            Counter: 0
          });
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
