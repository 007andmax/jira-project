import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { UsersStateService } from 'src/ng2/app/states/users/users-state.service';
import { LockScreenService } from '../../lock-screen/lock-screen.service';
import { LockScreen } from './class/lock-screen';
import { ModalLockValidate } from './class/modal-lock-validate';

@Component({
  selector: 'modal-lock-screen',
  templateUrl: './modal-lock-screen.component.html',
  styleUrls: ['./modal-lock-screen.component.css'],
  providers: [NgbModalConfig, NgbModal]
})

export class ModalLockScreenComponent implements OnInit {
  currentUser: any;
  codeShowed: boolean = false;
  validate: ModalLockValidate = new ModalLockValidate();
  lockScreen: LockScreen = new LockScreen();
  constructor(private usersStateService: UsersStateService,
    private lockScreenService: LockScreenService,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    public cd: ChangeDetectorRef,
    config: NgbModalConfig,) {
    config.backdrop = 'static';
    config.keyboard = false;
    console.log("config", config);
  }

  ngOnInit() {
    this.currentUser = this.usersStateService.getCurrentUser();
    this.cd.detectChanges();
    console.log("this.validate", this.validate);
  }
  onCodeChange() {
    this.validate.setWrongCode(true);
    this.validate.setValidate(true);
  }
  unlock() {
    console.log("this.validate", this.validate);
    if (this.validate.isValidate(this.lockScreen.code)) {
      this.lockScreen.setUnlocking(true);
      this.lockScreenService.unlockScreen(this.lockScreen.code).subscribe(resp => {
        this.activeModal.dismiss('Cross click');
        this.lockScreen.setUnlocking(false);
      }, resp => {
        console.log("resp", resp);
        if (resp.status === 409) this.validate.setWrongCode(false);
        this.lockScreen.setUnlocking(false);
      })
    } else {
      //  $scope.triedToUnlock = true;
    }
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
