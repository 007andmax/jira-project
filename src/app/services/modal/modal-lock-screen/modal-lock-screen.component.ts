import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { LockScreenService } from '../../lock-screen/lock-screen.service';
import { LockScreen } from './class/lock-screen';
import { ModalLockValidate } from './class/modal-lock-validate';

@Component({
  selector: 'modal-lock-screen',
  templateUrl: './modal-lock-screen.component.html',
  styleUrls: ['./modal-lock-screen.component.css'],
})

export class ModalLockScreenComponent implements OnInit {
  currentUser: any;
  codeShowed: boolean = false;
  @Input() reload: boolean;
  @Output() onClosed = new EventEmitter<any>();
  validate: ModalLockValidate = new ModalLockValidate();
  lockScreen: LockScreen = new LockScreen();
  show: boolean = false;
  constructor(private usersStateService: UsersStateService,
    private lockScreenService: LockScreenService,
    public cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.currentUser = this.usersStateService.getCurrentUser();
    this.usersStateService.getOnGetCurrentuser().subscribe(data => {
      this.currentUser = data;
      this.cd.detectChanges();
    })
    this.cd.detectChanges();
  }
  public showModal() {
    this.show = true;
  }
  onCodeChange() {
    this.validate.setWrongCode(true);
    this.validate.setValidate(true);
  }
  isEnableTwoFactorAuth() {
    return this.currentUser.twoFactorAuthType === 'SECURE' || this.currentUser.twoFactorAuthType === 'BASIC';
  }
  unlock() {
    if (this.validate.isValidate(this.lockScreen.code)) {
      this.lockScreen.setUnlocking(true);
      this.lockScreenService.unlockScreen(this.lockScreen.code).subscribe(resp => {
        //  this.activeModal.dismiss('Cross click');
        this.show = false;
        this.lockScreen.setUnlocking(false);
        this.cd.detectChanges();
        if (this.reload) window.location.reload();
        this.close();
      }, resp => {
        if (resp.status === 409) this.validate.setWrongCode(false);
        this.lockScreen.setUnlocking(false);
      })
    } else {
      //  $scope.triedToUnlock = true;
    }
  }
  close() {
    this.onClosed.emit(null);
  }
  sendCode() {
    this.lockScreen.setUnlocking(true);
    this.lockScreenService.sendUnlockScreenCode().subscribe(data => {
      this.lockScreen.setCodeSent(true);
      this.lockScreen.setUnlocking(false);
    })
  }
  public logOut() {
    window.location.href = '/logout';
    window.location.hash = '';
  }
}
