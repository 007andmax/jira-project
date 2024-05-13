import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ContractsStateService } from 'src/app/states/contracts/contracts-state.service';

@Component({
  selector: 'contracts-review',
  templateUrl: './contracts-review.component.html',
  styleUrls: ['./contracts-review.component.scss']
})
export class ContractsReviewComponent implements OnInit, OnDestroy {
  showNotificationReview: boolean = false;
  sub: Subscription = new Subscription();
  constructor(public contractsStateService: ContractsStateService) { }


  ngOnInit() {
    let getOnShowNotificationReview = this.contractsStateService.getOnShowNotificationReview().subscribe(data => {
      this.showNotificationReview = true;
    })
    this.sub.add(getOnShowNotificationReview);
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
