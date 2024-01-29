import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgbDropdown, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { ConfirmComponent } from 'src/app/components/shared/confirm/confirm.component';
import { ConfirmStateService } from 'src/app/components/shared/confirm/services/confirm-state.service';
import { DELETE_SIGNATURE } from 'src/app/const/confirm';
import { SignatureService } from 'src/app/services/signature/signature.service';
import { SignatureStateService } from 'src/app/states/signature/signature-state.service';
import { EditSignatureComponent } from './edit-signature/edit-signature.component';

@Component({
  selector: 'signature',
  templateUrl: './signature.component.html',
  styleUrls: ['./signature.component.scss']
})
export class SignatureComponent implements OnInit, OnDestroy {
  content: string;
  loading: boolean = true;
  sub: Subscription = new Subscription();
  @ViewChild('signatureDrop', { static: false }) signatureDrop: NgbDropdown;
  @ViewChild('signatureEditDrop', { static: true }) signatureEditDrop: NgbDropdown;
  @ViewChild('editSignature', { static: true }) editSignature: EditSignatureComponent;
  constructor(private signatureService: SignatureService,
    private confirmStateService: ConfirmStateService,
    private signatureStateService: SignatureStateService,
    private elRef: ElementRef,
    private modalService: NgbModal) { }

  ngOnInit() {
    this.signatureService.getSignature().subscribe((data: any) => {
      if (data) {
        this.content = data.content;
        if (data.content) this.elRef.nativeElement.querySelector(".content-html").insertAdjacentHTML('afterbegin', data.content);
      }
      this.loading = false;
    }, err => {
      this.loading = false;
    })
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === DELETE_SIGNATURE) {
          this.onRemove();
        }
      }
    })
    this.sub.add(getConfirm);
  }
  setContent(data) {
    this.content = data;
    this.elRef.nativeElement.querySelector(".content-html").innerHTML = '';
    this.elRef.nativeElement.querySelector(".content-html").insertAdjacentHTML('afterbegin', data);
  }
  editContent() {
    this.editSignature.onInitedit(this.content);
  }
  onRemove() {
    this.signatureService.removeSignature().subscribe(data => {
      this.content = null;
      this.elRef.nativeElement.querySelector(".content-html").innerHTML = '';

    })
  }
  remove() {
    this.confirmStateService.setConfirmAction(DELETE_SIGNATURE);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.message = `Remove Industry`;
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
