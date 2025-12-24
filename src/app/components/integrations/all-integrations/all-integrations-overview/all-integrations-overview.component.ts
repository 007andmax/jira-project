import { ChangeDetectorRef, Component, EventEmitter, OnDestroy, Output, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ConfirmComponent } from 'src/app/components/shared/confirm/confirm.component';
import { ConfirmStateService } from 'src/app/components/shared/confirm/services/confirm-state.service';
import { DISCONNECT_CONNECTION, REMOVE_CARD } from 'src/app/const/confirm';
import { DisabledBtnDirective } from 'src/app/directives/disabled-btn/disabled-btn.directive';
import { IntegrationsService } from 'src/app/services/integrations/integrations.service';
import { AppStateService } from 'src/app/states/app/app-state.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';

@Component({
  selector: 'app-all-integrations-overview',
  templateUrl: './all-integrations-overview.component.html',
  styleUrls: ['./all-integrations-overview.component.scss']
})
export class AllIntegrationsOverviewComponent implements OnDestroy {
  showPreloader: boolean = true;
  modelForm: UntypedFormGroup;
  submitted: boolean = false;
  isConnected: boolean = false;
  isEdit: boolean = false;
  status = 'DISCONNECTED';
  sub: Subscription = new Subscription();
  @Output() onInitRequest = new EventEmitter<any>();

  constructor(

    public cd: ChangeDetectorRef,
    public formBuilder: UntypedFormBuilder,
    private integrationsService: IntegrationsService,
    private toastrService: ToastrService,
    private appStateService: AppStateService,
    public companiesStateService: CompaniesStateService,
    private confirmStateService: ConfirmStateService,
    private modalService: NgbModal,


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
    this.integrationsService.getSettings().subscribe((res: any) => {
      this.showPreloader = false;
      this.isEdit = true;
      this.isConnected = res.connected;
      this.modelForm.patchValue({
        storeId: res.storeId,
        apiToken: res.apiToken,
        cryptType: res.cryptType
      })
      this.status = 'CONNECTED';
    }, err => {
      this.showPreloader = false;
    })
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === DISCONNECT_CONNECTION) this.onDisconnect();
      }
    })
    this.sub.add(getConfirm);
  }
  onDisconnect() {
    this.onInitRequest.emit(true);
    this.integrationsService.disconnect().subscribe(data => {
      this.confirmStateService.initRequest(false);
      this.submitted = false;
      this.isEdit = false;
      this.isConnected = false;
      this.status = 'DISCONNECTED';
      this.onInitRequest.emit(false);
      this.modelForm.reset();
      this.modelForm.patchValue({
        cryptType: "7"
      })
      this.companiesStateService.currentCompany.isMonerisConnected = false;
    }, err => {
      this.confirmStateService.initRequest(false);
      this.onInitRequest.emit(false);
    })
  }
  disconnect() {
    this.confirmStateService.setConfirmAction(DISCONNECT_CONNECTION);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.message = `If you disconnect Moneris, all saved credit cards for this company will be permanently deleted and cannot be recovered.
    <br/>You will no longer be able to process credit card payments or add new cards using Moneris for this company.`;
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
    ((this.isEdit) ? this.integrationsService.editSettings(this.modelForm.value) : this.integrationsService.setSettings(this.modelForm.value)).subscribe(data => {
      this.status = 'CONNECTED';
      this.isEdit = true;
      this.isConnected = data.connected;
      this.companiesStateService.currentCompany.isMonerisConnected = data.connected;
      this.onInitRequest.emit(false);
    }, err => {
      this.onInitRequest.emit(false);
    })
  }
  get f2() {
    return this.modelForm.controls;
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
