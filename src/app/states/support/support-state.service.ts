import { EventEmitter, Injectable } from '@angular/core';
import { DraftEmail } from 'src/app/components/shared/draft-email/class/draft-email';
import { DraftEmailService } from 'src/app/services/draft-email/draft-email.service';
import { AppStateService } from '../app/app-state.service';

@Injectable({
  providedIn: 'root'
})
export class SupportStateService {

  public handFilter: EventEmitter<any> = new EventEmitter();
  constructor(public draftEmailService: DraftEmailService,
    private appStateService: AppStateService,) { }
  public onSendMessage(data) {
    let draftEmail: DraftEmail = new DraftEmail();
    draftEmail.setContent(data.message);
    draftEmail.setSubject(data.subject);
    draftEmail.setRecipients(data.recipients);
    this.draftEmailService.sendMessage(draftEmail).subscribe((data) => {
      this.appStateService.changeDetectorRef();
    })
  }



  public getHandleFilter() {
    return this.handFilter;
  }
  public onHandleFilter(data) {
    this.handFilter.emit(data);
  }
}
