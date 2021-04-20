import { Component, OnInit, OnDestroy } from '@angular/core';
import { SettingStateService } from 'src/app/states/setting/setting-state.service';
declare var $: any;
@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})
export class SubscriptionComponent implements OnInit, OnDestroy {
  show = false;
  price = false;
  constructor(private settingStateService: SettingStateService) { }

  ngOnInit() {
    $('body').addClass('ng7');
    $('body').removeClass('backMenu');
    this.settingStateService.setComponentName('SubscriptionComponent');
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
