import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DraftEmailService } from '../../services/draft-email/draft-email.service';
import { SupportService } from '../../services/support/support.service';
import { DevicesRealTimeService } from '../../states/devices/devices-real-time.service';
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
  sub: Subscription = new Subscription();
  constructor(private supportService: SupportService,
    private supportStateService: SupportStateService,
    private draftEmailService: DraftEmailService,
    private devicesRealTimeService: DevicesRealTimeService,
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
      if (newChange.action === 'ONE_TIME_DELETED' || newChange.action === 'ONE_TIME_UNINSTALLED') {
        newChange.data.forEach(element => {
          let findIndex = this.list.findIndex(item => item.id === element);
          if (findIndex > -1) this.list.splice(findIndex, 1);
        });
      }
      this.cd.detectChanges();
    })
    this.sub.add(oneTimeConnectionArray);
  }
  create() {
    this.supportService.createOneTimeRemoteSession().subscribe(data => {

    })
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
