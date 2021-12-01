import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { MarketingEmailService } from 'src/app/services/marketing-email/marketing-email.service';
import { MarketingSubscriptionType } from '../class/marketing-subscription-type';

@Component({
  selector: 'add-marketing-subscription-type',
  templateUrl: './add-marketing-subscription-type.component.html',
  styleUrls: ['./add-marketing-subscription-type.component.scss']
})
export class AddMarketingSubscriptionTypeComponent implements OnInit {

  name: string = "";
  disableCreate: boolean = false;
  @Input() marketingSubscriptionList: Array<MarketingSubscriptionType> = [];
  @Output() onClose: EventEmitter<any> = new EventEmitter();
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
        () => {
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
