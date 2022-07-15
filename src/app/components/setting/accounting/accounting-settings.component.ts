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
import { InvoiceTicketsService } from './accounting-settings.service';
declare var $: any;
@Component({
  selector: 'app-accounting-settings',
  templateUrl: './accounting-settings.component.html',
  styleUrls: ['./accounting-settings.component.scss']
})
export class AccountingSettingsComponent implements OnInit, OnDestroy {
  loading = false;
  activeTab: string = "invoiceSettings";
  sub: Subscription = new Subscription();
  @ViewChild('glNumber') glNumber: GlNumberSettingsComponent;
  constructor(private invoiceTicketsService: InvoiceTicketsService,
    private glNumberStateService: GlNumberStateService,
    private confirmStateService: ConfirmStateService,
    private modalService: NgbModal,
    private glNumberService: GlNumberService,
    public cd: ChangeDetectorRef,
    private settingStateService: SettingStateService) { }

  ngOnInit() {
    $('body').addClass('ng7');
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
    $('body').removeClass('ng7');
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
  removeGls() {
    this.confirmStateService.setConfirmAction(DELETE_LIST_GL_NUMBERS);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal', backdrop: 'static', keyboard: false });
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
