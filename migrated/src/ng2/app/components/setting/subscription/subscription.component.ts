import { Component, OnInit, OnDestroy } from '@angular/core';
declare var $:any;
@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})
export class SubscriptionComponent implements OnInit, OnDestroy {
show = false;
  constructor() { }

  ngOnInit() {
    $('body').addClass('ng7');
    $('body').removeClass('backMenu');
  }

  ngOnDestroy() {
    $('body').removeClass('ng7');
  }
  
  onBackMenu() {
    let body = document.getElementsByTagName("body")[0];
    body.classList.remove("backMenu"); //remove the class
    body.classList.add("backMenu");
  }

}
