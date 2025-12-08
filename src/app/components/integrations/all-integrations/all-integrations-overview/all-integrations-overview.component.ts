import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DisabledBtnDirective } from 'src/app/directives/disabled-btn/disabled-btn.directive';
import { IntegrationsService } from 'src/app/services/integrations/integrations.service';
import { AppStateService } from 'src/app/states/app/app-state.service';

@Component({
  selector: 'app-all-integrations-overview',
  templateUrl: './all-integrations-overview.component.html',
  styleUrls: ['./all-integrations-overview.component.scss']
})
export class AllIntegrationsOverviewComponent {
  modelForm: UntypedFormGroup;
  submitted: boolean = false;
  isEdit: boolean = false;
  @ViewChild('addBtn', { static: false }) addBtn: DisabledBtnDirective;
  constructor(

    public cd: ChangeDetectorRef,
    public formBuilder: UntypedFormBuilder,
    private integrationsService: IntegrationsService,


  ) { }

  ngOnInit() {
    this.modelForm = this.formBuilder.group({
      storeId: [
        "",
        [Validators.required, Validators.maxLength(10)]
      ],
      apiToken: [
        "",
        [Validators.required, Validators.maxLength(20)]
      ],
      cryptType: [
        "7",
        [Validators.required,]
      ],
    })
    this.modelForm.get('cryptType')?.disable();
    this.integrationsService.getSettings().subscribe((res: any) => {
      this.isEdit = true;
      this.modelForm.patchValue({
        storeId: res.storeId,
        apiToken: res.apiToken,
        cryptType: res.cryptType || 7
      })
    })

  }
  add() {
    this.submitted = true;
    if (this.modelForm.invalid) {
      return;
    }
    this.addBtn.setDisabled(true);
    ((this.isEdit) ? this.integrationsService.editSettings(this.modelForm.value) : this.integrationsService.setSettings(this.modelForm.value)).subscribe(data => {
      this.addBtn.setDisabled(false);
    }, err => {
      this.addBtn.setDisabled(false);
    })
  }
  get f2() {
    return this.modelForm.controls;
  }
}
