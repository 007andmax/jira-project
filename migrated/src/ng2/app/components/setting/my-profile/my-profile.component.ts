import { Component, OnInit, OnDestroy } from "@angular/core";
import { SettingService } from "src/ng2/app/services/setting/setting.service";
declare var $: any;
@Component({
  selector: "app-my-profile",
  templateUrl: "./my-profile.component.html",
  styleUrls: ["./my-profile.component.scss"]
})
export class MyProfileComponent implements OnInit, OnDestroy {
  constructor() {}

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
