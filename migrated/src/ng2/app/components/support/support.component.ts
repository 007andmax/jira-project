import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { DevicesService } from '../../services/devices/devices.service';
import { DraftEmailService } from '../../services/draft-email/draft-email.service';
import { ModalCustomShareScreenComponent } from '../../services/modal/modal-custom-share-screen/modal-custom-share-screen.component';
import { SupportService } from '../../services/support/support.service';
import { ConstantsStateService } from '../../states/constants/constants-state.service';
import { DevicesRealTimeService } from '../../states/devices/devices-real-time.service';
import { DevicesStateService } from '../../states/devices/devices-state.service';
import { SupportStateService } from '../../states/support/support-state.service';
import { DraftEmail } from '../shared/draft-email/class/draft-email';
import { RemoteSession } from './class/remote-sessions';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.scss']
})
export class SupportComponent implements OnInit, OnDestroy {
  list: Array<RemoteSession> = [];
  realSessionId: string;
  companyId: string;
  sub: Subscription = new Subscription();
  constructor(private supportService: SupportService,
    private supportStateService: SupportStateService,
    private draftEmailService: DraftEmailService,
    private devicesRealTimeService: DevicesRealTimeService,
    private devicesService: DevicesService,
    private modalService: NgbModal,
    private constantsStateService: ConstantsStateService,
    private devicesStateService: DevicesStateService,
    public cd: ChangeDetectorRef,) { }


  ngOnInit() {
    this.supportService.getRemoteSessions().subscribe(data => {
      this.list = data;
      console.log("this.list", this.list);
      this.cd.detectChanges();
    })
    this.supportStateService.getHandleSendMode().subscribe(data => {
      let draftEmail: DraftEmail = new DraftEmail();
      draftEmail.setContent(data.message);
      draftEmail.setSubject(data.subject);
      draftEmail.setRecipients(data.recipients);
      console.log("draftEmail", draftEmail);
      console.log("data", data);
      this.draftEmailService.sendMessage(draftEmail).subscribe((data) => {
        if (!this.cd['destroyed']) {
          this.cd.detectChanges();
        }
      })
    })
    let oneTimeConnectionArray = this.devicesRealTimeService.oneTimeConnectionArray.subscribe(newChange => {
      console.log("newChange", newChange);
      if (newChange.action === 'ONE_TIME_DOWNLOADED' || newChange.action === 'ONE_TIME_INSTALLED' || newChange.action === 'ONE_TIME_CONNECTION_OPEN' || newChange.action === 'ONE_TIME_URL_GENERATED') {
        if (newChange.data.oneTime) {
          let findIndex = this.list.findIndex(item => item.id === newChange.data.id);
          if (findIndex > -1) {
            this.list[findIndex] = new RemoteSession(newChange.data);
          } else {
            this.list.push(new RemoteSession(newChange.data));
          }
        }
      }
      if (newChange.action === 'ONE_TIME_DELETED') { //newChange.action === 'ONE_TIME_UNINSTALLED'
        // newChange.data.forEach(element => {
        let findIndex = this.list.findIndex(item => item.id === newChange.data);
        if (findIndex > -1) this.list.splice(findIndex, 1);
        //  });
      }
      this.cd.detectChanges();
    })
    this.sub.add(oneTimeConnectionArray);

    let getOnRemoveConnection = this.devicesStateService.getOnRemoveConnection().subscribe(data => {
      let remoteConnectPort = this.constantsStateService.getConstant('remote.connect.port'),
        restServerAddress = this.constantsStateService.getConstant('rest.server.address'),
        url = 'quicktech://connect?serverIP=' + restServerAddress + '&port=' + remoteConnectPort + '&sessionID=' + this.realSessionId;
      window.open(url, '_self');
    })
    this.sub.add(getOnRemoveConnection);
  }
  create() {
    this.supportService.createOneTimeRemoteSession().subscribe(data => {

    })
  }
  onConnectRemoteAccess(data) {
    this.companyId = data.companyId;
    if (!data.sessionId) {
      throw 'SessionId is required';
    }
    if (!data.conectionType) {
      throw 'conectionType is required';
    }
    this.devicesService.getSessionId(data.sessionId, data.conectionType).subscribe((realSessionId: any) => {
      if (!realSessionId || !realSessionId.sessionId || realSessionId.sessionId.length < 1) {
        throw "Not session Id"
      } else {
        this.createRemoteAccess(realSessionId.sessionId);
      }
    });

  }
  createRemoteAccess(realSessionId) {
    this.realSessionId = realSessionId;
    const modalRef = this.modalService.open(ModalCustomShareScreenComponent, null);
    modalRef.componentInstance.companyId = this.companyId;
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
