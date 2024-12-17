import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin, of, Subscription } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { DELETE_LIST_GL_NUMBERS } from 'src/app/const/confirm';
import { GlNumberStateService } from 'src/app/states/gl-number/gl-number-state.service';
import { SettingStateService } from 'src/app/states/setting/setting-state.service';
import { ConfirmComponent } from '../../shared/confirm/confirm.component';
import { ConfirmStateService } from '../../shared/confirm/services/confirm-state.service';
import { GlNumberSettingsComponent } from './gl-number/gl-number.component';
import { GlNumberService } from './gl-number/gl-number.service';
import { InvoiceTicketsService } from '../../../services/accounting/accounting-settings.service';
import { InvoiceSettingsComponent } from './invoice-settings/invoice-settings.component';
import { QuotesSettingsComponent } from './quotes-settings/quotes-settings.component';
import { AccountingYearComponent } from './accounting-year/accounting-year.component';
import { TaxesSettingsComponent } from './taxes/taxes.component';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
import { CustomNotesSettingsComponent } from './custom-notes-settings/custom-notes-settings.component';
import { BillableStateService } from 'src/app/states/billable/billable-state.service';
import { fadeInAnimation } from 'src/app/animations';
declare var $: any;
@Component({
  selector: 'app-accounting-settings',
  templateUrl: './accounting-settings.component.html',
  animations: [fadeInAnimation],
  // attach the fade in animation to the host (root) element of this component
  host: { '[@fadeInAnimation]': '' },
  styleUrls: ['./accounting-settings.component.scss']
})
export class AccountingSettingsComponent implements OnInit, OnDestroy {
  @ViewChild('invoiceSettings', { static: true }) invoiceSettings: InvoiceSettingsComponent;
  @ViewChild('quotesSettings', { static: true }) quotesSettings: QuotesSettingsComponent;
  @ViewChild('accountingYear', { static: true }) accountingYear: AccountingYearComponent;
  @ViewChild('taxesSettings') taxesSettings: TaxesSettingsComponent;
  @ViewChild('glNumber', { static: true }) glNumber: GlNumberSettingsComponent;
  @ViewChild('customNotes', { static: true }) customNotes: CustomNotesSettingsComponent;
  loading = false;
  toggleAddTax: boolean = false;
  activeTab: string = "invoiceSettings";
  sub: Subscription = new Subscription();

  constructor(private invoiceTicketsService: InvoiceTicketsService,
    private glNumberStateService: GlNumberStateService,
    private confirmStateService: ConfirmStateService,
    private modalService: NgbModal,
    private glNumberService: GlNumberService,
    public cd: ChangeDetectorRef,
    private permissionsService: PermissionsService,
    public billableStateService: BillableStateService,
    private settingStateService: SettingStateService) { }

  ngOnInit() {
    $('body').addClass('page-settings');
    $('body').removeClass('backMenu');

    this.settingStateService.setComponentName('InvoiceTicketsComponent');
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === DELETE_LIST_GL_NUMBERS) {
          this.onRemoveGlNumbers();
        }
      }
    })
    this.sub.add(getConfirm);
  }

  ngOnDestroy() {
    $('body').removeClass('page-settings');
    this.sub.unsubscribe();
  }

  onBackMenu() {
    let body = document.getElementsByTagName("body")[0];
    body.classList.remove("backMenu"); //remove the class
    body.classList.add("backMenu");
  }
  onRemoveGlNumbers() {
    forkJoin(this.glNumberStateService.getListGlNumbersForRemove().map(item => this.glNumberService.delete(item.id).pipe(map((res) => res),
      catchError(error => of(undefined)))))
      .subscribe(
        () => {
          this.glNumberStateService.setListGlNumbersForRemove([]);
          this.cd.detectChanges();
        },
        error => {
        }
      );
  }
  addCustomeNote() {
    this.billableStateService.initAddNote();
  }
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }
  onSubmit() {
    if (this.invoiceSettings) this.invoiceSettings.onSubmit();
    if (this.quotesSettings) this.quotesSettings.onSubmit();
    if (this.accountingYear) this.accountingYear.saveAccountingDate();

  }
  removeGls() {
    this.confirmStateService.setConfirmAction(DELETE_LIST_GL_NUMBERS);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.message = `Remove Income Account Number`;
  }
  getSelectedCount() {
    return this.glNumberStateService.getListGlNumbersForRemove().length;
  }
  setTab(data) {
    this.activeTab = data['nextId'];
  }
  create() {
    this.glNumber.toggleShowAddGL(true);
  }

}
