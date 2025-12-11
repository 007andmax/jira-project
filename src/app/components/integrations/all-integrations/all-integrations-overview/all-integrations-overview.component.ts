import { ChangeDetectorRef, Component, EventEmitter, Output, ViewChild } from '@angular/core';
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
  isConnected: boolean = false;
  isEdit: boolean = false;
  status = 'DISCONNECTED';
  @Output() onInitRequest = new EventEmitter<any>();

  constructor(

    public cd: ChangeDetectorRef,
    public formBuilder: UntypedFormBuilder,
    private integrationsService: IntegrationsService,
    private toastrService: ToastrService,
    private appStateService: AppStateService,

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
    //  this.modelForm.get('cryptType')?.disable();
    this.integrationsService.getSettings().subscribe((res: any) => {
      this.isEdit = true;
      this.isConnected = res.connected;
      console.log("res", res);
      this.modelForm.patchValue({
        storeId: res.storeId,
        apiToken: res.apiToken,
        cryptType: res.cryptType
      })
      this.status = 'CONNECTED';
      console.log("this.modelForm.value", this.modelForm.value)
    })

  }
  disconnect() {

    this.onInitRequest.emit(true);
    //  this.addBtn.setDisabled(true);
    this.integrationsService.disconnect().subscribe(data => {
      //  this.addBtn.setDisabled(false);
      this.submitted = false;
      this.isEdit = false;
      this.isConnected = false;
      this.status = 'DISCONNECTED';
      this.onInitRequest.emit(false);
      this.modelForm.reset();
      this.modelForm.patchValue({
        cryptType: "7"
      })
    }, err => {
      //  this.addBtn.setDisabled(false);
      this.onInitRequest.emit(false);
    })
  }
  copy(data) {
    let textArea: any = document.createElement("textarea");
    textArea.style.opacity = 0;
    textArea.value = data;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      let successful = document.execCommand('copy');
    } catch (err) {
      //  UserNotificationService.show('Copy failed', true);
    }
    document.body.removeChild(textArea);
    this.toastrService.success("The value is copied to clipboard");
    this.appStateService.changeDetectorRef();
  }
  save() {
    this.submitted = true;
    if (this.modelForm.invalid) {
      return;
    }
    this.onInitRequest.emit(true);
    //  this.addBtn.setDisabled(true);
    console.log("this.modelForm.value", this.modelForm.value);
    ((this.isEdit) ? this.integrationsService.editSettings(this.modelForm.value) : this.integrationsService.setSettings(this.modelForm.value)).subscribe(data => {
      //  this.addBtn.setDisabled(false);
      this.status = 'CONNECTED';
      this.isEdit = true;
      this.isConnected = data.connected;
      this.onInitRequest.emit(false);
    }, err => {
      //  this.addBtn.setDisabled(false);
      this.onInitRequest.emit(false);
    })
  }
  get f2() {
    return this.modelForm.controls;
  }
}
