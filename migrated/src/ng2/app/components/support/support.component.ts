import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DraftEmailService } from '../../services/draft-email/draft-email.service';
import { SupportService } from '../../services/support/support.service';
import { SupportStateService } from '../../states/support/support-state.service';
import { DraftEmail } from '../shared/draft-email/class/draft-email';
import { RemoteSession } from './class/remote-sessions';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.scss']
})
export class SupportComponent implements OnInit {
  list: Array<RemoteSession> = [];

  constructor(private supportService: SupportService,
    private supportStateService: SupportStateService,
    private draftEmailService: DraftEmailService,
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
  }

}
