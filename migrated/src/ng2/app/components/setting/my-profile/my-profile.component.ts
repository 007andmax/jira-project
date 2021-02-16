import { Component, OnInit, OnDestroy } from "@angular/core";
import { SettingService } from "src/ng2/app/services/setting/setting.service";
import { SettingStateService } from "src/ng2/app/states/setting/setting-state.service";
declare var $: any;
@Component({
  selector: "app-my-profile",
  templateUrl: "./my-profile.component.html",
  styleUrls: ["./my-profile.component.scss"]
})
export class MyProfileComponent implements OnInit, OnDestroy {
  constructor(private settingStateService: SettingStateService) { }

  ngOnInit() {
    $('body').addClass('ng7');
    $('body').removeClass('backMenu');
    $(".loading").css({ "top": "100px", "bottom": "unset" });
    this.settingStateService.setComponentName('MyProfileComponent');
  }

  ngOnDestroy() {
    $('body').removeClass('ng7');
    $(".loading").css({ "top": "-53px", "bottom": "0" });
  }

  onBackMenu() {
    let body = document.getElementsByTagName("body")[0];
    body.classList.remove("backMenu"); //remove the class
    body.classList.add("backMenu");
  }
}
