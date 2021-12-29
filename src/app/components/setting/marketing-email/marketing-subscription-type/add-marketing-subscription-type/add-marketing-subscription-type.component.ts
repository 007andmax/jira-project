import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { MODE_ADD_BY_MODAL } from 'src/app/const/user-subscription';
import { MarketingEmailService } from 'src/app/services/marketing-email/marketing-email.service';
import { MarketingSubscriptionType } from '../class/marketing-subscription-type';

@Component({
  selector: 'add-marketing-subscription-type',
  templateUrl: './add-marketing-subscription-type.component.html',
  styleUrls: ['./add-marketing-subscription-type.component.scss']
})
export class AddMarketingSubscriptionTypeComponent implements OnInit {
  MODE_ADD_BY_MODAL = MODE_ADD_BY_MODAL;
  name: string = "";
  disableCreate: boolean = false;
  @Input() mode: string;
  @Input() marketingSubscriptionList: Array<MarketingSubscriptionType> = [];
  @Output() onClose: EventEmitter<any> = new EventEmitter();
  @Output() onAdded: EventEmitter<any> = new EventEmitter();
  constructor(private marketingEmailService: MarketingEmailService) { }

  ngOnInit() {
  }
  checkDublicate() {
    var duplicateCategory = this.marketingSubscriptionList.filter((item) => {
      return item.name.toLowerCase() === this.name.toLowerCase();
    });
    if (duplicateCategory && duplicateCategory[0]) {
      return this.disableCreate = true;
    } else {
      return this.disableCreate = false;
    }
  };
  save() {
    if (this.name.length === 0 || this.disableCreate) return;
    this.marketingEmailService.addSubscriptionType(this.name).pipe(map((res) => res),
      catchError(error => of(undefined)))
      .subscribe(
        (data) => {
          this.onAdded.emit(data);
          this.onClose.emit(null);
        },
        error => {
        }
      );
  }
  onKeyUp(event) {
    if (event.keyCode === 13) this.save();
  }

}
