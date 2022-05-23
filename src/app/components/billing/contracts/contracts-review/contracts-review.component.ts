import { Component, OnInit } from '@angular/core';
import { ContractsStateService } from 'src/app/states/contracts/contracts-state.service';

@Component({
  selector: 'contracts-review',
  templateUrl: './contracts-review.component.html',
  styleUrls: ['./contracts-review.component.scss']
})
export class ContractsReviewComponent implements OnInit {
  showNotificationReview: boolean = false;
  constructor(public contractsStateService: ContractsStateService) { }

  ngOnInit() {
    let getOnShowNotificationReview = this.contractsStateService.getOnShowNotificationReview().subscribe(data => {
      this.showNotificationReview = true;
    })
  }

}
