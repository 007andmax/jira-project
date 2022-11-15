import { EventEmitter, Injectable } from '@angular/core';
import { EmailTemplateRealTimeService } from './email-template-real-time.service';

@Injectable({
  providedIn: 'root',
})
export class EmailTemplateStateService {
  onChangeEmailTemplates: EventEmitter<any> = new EventEmitter();
  constructor(private emailTemplateRealTimeService: EmailTemplateRealTimeService) { }

  public onInit() {
    this.emailTemplateRealTimeService.changeArray.subscribe(data => {
      this.onChangeEmailTemplates.emit(data);
    })
  }
}
