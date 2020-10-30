import { Component, OnInit } from '@angular/core';
import { LeftPanelStateService } from 'src/ng2/app/states/left-panel/left-panel-state.service';

/**
 * Password quotes component
 */
@Component({
  selector: 'app-quotes',
  templateUrl: './quotes.component.html',
  styleUrls: ['./quotes.component.scss'],
  
})
export class QuotesComponent implements OnInit {

  constructor(
    private leftPanelStateService:LeftPanelStateService,
  ) {
  }

  /**
   * Initializes quotes. See [ngOnInit]{@see OnInit#ngOnInit}
   */
  ngOnInit() {
    this.leftPanelStateService.setBillingpage('quotes-component');
  }
}
