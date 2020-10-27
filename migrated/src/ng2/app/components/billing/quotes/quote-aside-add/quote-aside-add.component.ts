import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DisabledBtnDirective } from 'src/ng2/app/directives/disabled-btn.directive';
import { QuoteService } from 'src/ng2/app/services/quote/quote.service';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
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
  @ViewChild('saveAndContinueBtn') saveAndContinueBtn: DisabledBtnDirective;
  @ViewChild('saveAndApproveBtn') saveAndApproveBtn: DisabledBtnDirective;
  @ViewChild('saveAndDownloadBtn') saveAndDownloadBtn: DisabledBtnDirective;
  @ViewChild('quoteAdd') quoteAdd: QuoteAsideAddBodyComponent;
  showPreview: boolean = false;
  quotePreview: QuotePreview;
  open:boolean = false;
  sub:Subscription = new Subscription();
  constructor(private quoteStateService: QuoteStateService,
    private companiesStateService: CompaniesStateService,
    private quoteService: QuoteService,) { }

  ngOnInit() {
    let getOnCreate =  this.quoteStateService.getOnCreate().subscribe(quote => {
      this.open = true;
    })
    this.sub.add(getOnCreate);
  }
  public saveAndContinue() {
    this.saveAndContinueBtn.setDisabled(true);
    let quote:QuoteAdd = this.quoteAdd.getQuote();
    this.quoteService.createQuote(quote.getDataForCreate(false)).subscribe();
  }
  public saveAndApprove() {
    this.quoteService.createQuote(quote.getDataForCreate(false))
      .subscribe((res) => {
        this.quoteService.approveQuote(res['company'], res['id'])
          .subscribe((res) => {
            this.quoteStateService.goToQuote();
          });
      });
  }

  onPreview() {
    
    this.quotePreview = new QuotePreview(this.quoteAdd.getQuotePreview());
    this.showPreview = true;
  }

}
