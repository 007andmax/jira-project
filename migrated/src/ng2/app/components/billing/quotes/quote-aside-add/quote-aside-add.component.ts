import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { QuoteAdd } from '../class/quote-add';
import { QuoteStateService } from '../quote-create/quote-state.service';

@Component({
  selector: 'app-quote-aside-add',
  templateUrl: './quote-aside-add.component.html',
  styleUrls: ['./quote-aside-add.component.scss']
})
export class QuoteAsideAddComponent implements OnInit {
  quote:QuoteAdd = new QuoteAdd();
  open:boolean = false;
  sub:Subscription = new Subscription();
  constructor(private quoteStateService: QuoteStateService) { }

  ngOnInit() {
    let getOnPreview =  this.quoteStateService.getOnCreate().subscribe(quote => {
      this.open = true;
    })
    this.sub.add(getOnPreview);
  }

}
