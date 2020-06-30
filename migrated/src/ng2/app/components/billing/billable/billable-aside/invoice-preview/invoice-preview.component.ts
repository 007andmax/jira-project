import { Component, OnInit } from '@angular/core';
import { BillableStateService } from 'src/ng2/app/states/billable/billable-state.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-invoice-preview',
  templateUrl: './invoice-preview.component.html',
  styleUrls: ['./invoice-preview.component.scss']
})
export class InvoicePreviewComponent implements OnInit {
  opened:boolean = false;
  sub: Subscription = new Subscription();
  constructor(private billableStateService:BillableStateService) { }

  ngOnInit() {
    let getOnPreview = this.billableStateService.getOnPreview().subscribe(data => {
     
      this.opened = true;

   
      
    })
    this.sub.add(getOnPreview);
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
   
  }
}
