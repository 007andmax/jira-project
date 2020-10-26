import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { DisabledBtnDirective } from 'src/ng2/app/directives/disabled-btn.directive';
import { BillableAsideComponent } from '../../billable/billable-aside/billable-aside.component';
import { QuoteAdd } from '../class/quote-add';
import { QuotePreview } from '../class/quote-preview';
import { QuoteStateService } from '../quote-create/quote-state.service';
import { QuoteAsideAddBodyComponent } from './quote-aside-add-body/quote-aside-add-body.component';

@Component({
  selector: 'app-quote-aside-add',
  templateUrl: './quote-aside-add.component.html',
  styleUrls: ['./quote-aside-add.component.scss']
})
export class QuoteAsideAddComponent implements OnInit {
  @ViewChild('saveAndSendBtn') saveAndSendBtn: DisabledBtnDirective;
  @ViewChild('saveAndPrintBtn') saveAndPrintBtn: DisabledBtnDirective;
  @ViewChild('saveAndDownloadBtn') saveAndDownloadBtn: DisabledBtnDirective;
  @ViewChild('quoteAdd') quoteAdd: QuoteAsideAddBodyComponent;
  showPreview: boolean = false;
  quote:QuoteAdd = new QuoteAdd();
  quotePreview: QuotePreview;
  open:boolean = false;
  sub:Subscription = new Subscription();
  constructor(private quoteStateService: QuoteStateService) { }

  ngOnInit() {
    let getOnCreate =  this.quoteStateService.getOnCreate().subscribe(quote => {
      this.open = true;
    })
    this.sub.add(getOnCreate);
  }
  onPreview() {
    
    this.quotePreview = new QuotePreview(this.quoteAdd.getQuotePreview());
    this.showPreview = true;
  }

}
