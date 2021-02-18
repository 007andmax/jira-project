import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { DevicesService } from '../../services/devices/devices.service';
import { DraftEmailService } from '../../services/draft-email/draft-email.service';
import { SupportService } from '../../services/support/support.service';
import { ConstantsStateService } from '../../states/constants/constants-state.service';
import { DevicesRealTimeService } from '../../states/devices/devices-real-time.service';
import { DevicesStateService } from '../../states/devices/devices-state.service';
import { SupportStateService } from '../../states/support/support-state.service';
import { UsersStateService } from '../../states/users/users-state.service';
import { CompanyDevicesRemoteAccessComponent } from '../company-devices/company-devices-remote-access/company-devices-remote-access.component';
import { DraftEmail } from '../shared/draft-email/class/draft-email';
import { RemoteSession } from './class/remote-sessions';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.scss']
})
export class SupportComponent implements OnInit, OnDestroy {
  showPreloader: boolean = true;
  list: Array<RemoteSession> = [];
  filter: string = "ALL";
  reqList: Array<RemoteSession> = [];
  realSessionId: string;
  companyId: string;
  sub: Subscription = new Subscription();
  constructor(private supportService: SupportService,
    private supportStateService: SupportStateService,
    private draftEmailService: DraftEmailService,
    private devicesRealTimeService: DevicesRealTimeService,
    private devicesService: DevicesService,
    private modalService: NgbModal,
    private usersStateService: UsersStateService,
    private constantsStateService: ConstantsStateService,
    private devicesStateService: DevicesStateService,
    public cd: ChangeDetectorRef,) { }

  ngOnInit() {
    this.supportService.getRemoteSessions().subscribe(data => {
      data.sort((a, b) => (b.createdAt > a.createdAt) ?
        1 : ((a.createdAt > b.createdAt) ? -1 : 0));
      this.list = data;
      this.reqList = data;
      this.showPreloader = false;
      this.cd.detectChanges();
    })
    this.supportStateService.getHandleSendMode().subscribe(data => {
      let draftEmail: DraftEmail = new DraftEmail();
      draftEmail.setContent(data.message);
      draftEmail.setSubject(data.subject);
      draftEmail.setRecipients(data.recipients);
      this.draftEmailService.sendMessage(draftEmail).subscribe((data) => {
        if (!this.cd['destroyed']) {
          this.cd.detectChanges();
        }
      })
    })
    let oneTimeConnectionArray = this.devicesRealTimeService.oneTimeConnectionArray.subscribe(newChange => {
      if (newChange.action === 'ONE_TIME_DOWNLOADED' || newChange.action === 'ONE_TIME_INSTALLED' || newChange.action === 'ONE_TIME_CONNECTION_OPEN' || newChange.action === 'ONE_TIME_URL_GENERATED' || newChange.action === 'ONE_TIME_URL_OPEN' || newChange.action === 'ONE_TIME_ONLINE' || newChange.action === 'ONE_TIME_OFFLINE') {
        if (newChange.data.oneTime) {
          let findIndex = this.reqList.findIndex(item => item.id === newChange.data.id);
          if (findIndex > -1) {
            this.reqList[findIndex] = new RemoteSession(newChange.data);
          } else {
            this.reqList.push(new RemoteSession(newChange.data));
          }
          this.updateList();
        }
      }
      if (newChange.action === 'ONE_TIME_DELETED' || newChange.action === 'ONE_TIME_UNINSTALLED') {
        newChange.data.forEach(element => {
          let findIndex = this.reqList.findIndex(item => item.id === element);
          if (findIndex > -1) this.reqList.splice(findIndex, 1);
          this.updateList();
        });
      }
      this.cd.detectChanges();
    })
    this.sub.add(oneTimeConnectionArray);

    /* let getOnRemoveConnection = this.devicesStateService.getOnRemoveConnection().subscribe(data => {
       let remoteConnectPort = this.constantsStateService.getConstant('remote.connect.port'),
         restServerAddress = this.constantsStateService.getConstant('rest.server.address'),
         url = 'quicktech://connect?serverIP=' + restServerAddress + '&port=' + remoteConnectPort + '&sessionID=' + this.realSessionId;
       window.open(url, '_self');
     })
     this.sub.add(getOnRemoveConnection);*/

    let getHandleFilter = this.supportStateService.getHandleFilter().subscribe(data => {
      this.filter = data;
      this.updateList();
    })
    this.sub.add(getHandleFilter);
  }
  private updateList() {
    if (this.filter === "ALL") {
      this.list = this.reqList.map(item => new RemoteSession(JSON.parse(JSON.stringify(item))));
    } else {
      this.list = this.reqList.filter(item => item.performer.id === this.usersStateService.getCurrentUser().id).map(item => new RemoteSession(JSON.parse(JSON.stringify(item))));
    }
    this.cd.detectChanges();
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
    this.createRemoteAccess(data.sessionId, data.conectionType);
  }
  createRemoteAccess(realSessionId, connectionType) {
    this.realSessionId = realSessionId;
    const modalRef = this.modalService.open(CompanyDevicesRemoteAccessComponent, { windowClass: 'device-send-modal' });
    modalRef.componentInstance.remoteSessionId = this.realSessionId;
    modalRef.componentInstance.companyId = this.companyId;
    modalRef.componentInstance.connectionType = connectionType;
    modalRef.componentInstance.action = 'CONNECT_SUPPORT_DEVICE';
    document.body.click();
    this.cd.detectChanges();
  }
  public trackById(index, item) {
    return item.id;
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
