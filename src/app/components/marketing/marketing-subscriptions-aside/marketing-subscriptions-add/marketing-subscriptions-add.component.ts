import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { MarketingSubscriptionType } from 'src/app/components/setting/marketing-email/marketing-subscription-type/class/marketing-subscription-type';
import { MarketingEmailService } from 'src/app/services/marketing-email/marketing-email.service';
import { MatErrorComponent } from '../../../shared/mat-error/mat-error.component';
import { FormsModule } from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';

@Component({
    selector: 'app-marketing-subscriptions-add',
    templateUrl: './marketing-subscriptions-add.component.html',
    styleUrls: ['./marketing-subscriptions-add.component.scss'],
    standalone: true,
    imports: [NgClass, FormsModule, NgIf, MatErrorComponent]
})
export class MarketingSubscriptionsAddComponent implements OnInit {
  name: string = "";
  disableCreate: boolean = false;
  isInitRequest: boolean = false;
  @Input() mode: string;
  @Input() marketingSubscriptionList: Array<MarketingSubscriptionType> = [];
  constructor(private marketingEmailService: MarketingEmailService,
    public activeModal: NgbActiveModal) { }

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
    if (this.name.length === 0 || this.disableCreate || this.isInitRequest) return;
    this.isInitRequest = true;
    this.marketingEmailService.addSubscriptionType(this.name).pipe(map((res) => res),
      catchError(error => of(undefined)))
      .subscribe(
        (data) => {
          this.isInitRequest = false;
          this.close();
        },
        error => {
          this.isInitRequest = false;
        }
      );
  }
  onKeyUp(event) {
    if (event.keyCode === 13) this.save();
  }
  close() {
    this.activeModal.close();
  }
}
