import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-quote-create-content-bottom',
  templateUrl: './quote-create-content-bottom.component.html',
  styleUrls: ['./quote-create-content-bottom.component.scss']
})
export class QuoteCreateContentBottomComponent implements OnInit {

  @Input() set clientId(value: any) {
    this.client = value;
  }

  public serviceList: any;
  public client: any;
  public type: string;
  public itemsArray = [];


  constructor(
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {}

  public addProduct() {
    this.type = 'product';
  }

  public addService() {
    this.type = 'service';
  }

  public addItemToItemsArray(item) {
    this.itemsArray.push(item);
    this.cdr.detectChanges();
  }

  public changeType(type) {
    this.type = type;
  }

}
