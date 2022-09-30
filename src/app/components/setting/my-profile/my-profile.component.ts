import { Component, OnInit, OnDestroy, Input, ViewChild } from "@angular/core";
import { SettingService } from "src/app/services/setting/setting.service";
import { SettingStateService } from "src/app/states/setting/setting-state.service";
import { AccountComponent } from "./account/account.component";
import { EmailNotificationsComponent } from "./email-notifications/email-notifications.component";
import { ProfileComponent } from "./profile/profile.component";
declare var $: any;
@Component({
  selector: "app-my-profile",
  templateUrl: "./my-profile.component.html",
  styleUrls: ["./my-profile.component.scss"]
})
export class MyProfileComponent implements OnInit, OnDestroy {
  @ViewChild('profile') profile: ProfileComponent;
  @ViewChild('account') account: AccountComponent;
  @ViewChild('emailNotifications') emailNotifications: EmailNotificationsComponent;
  constructor(private settingStateService: SettingStateService) { }

  ngOnInit() {
    $('body').addClass('page-settings');
    // $('body').addClass('ng7');
    $('body').removeClass('backMenu');
    $(".loading").css({ "top": "100px", "bottom": "unset" });
    this.settingStateService.setComponentName('MyProfileComponent');
  }

  ngOnDestroy() {
    $('body').removeClass('page-settings');
    // $('body').removeClass('ng7');
    $(".loading").css({ "top": "-53px", "bottom": "0" });
  }
  onSubmit() {
    if (this.profile) this.profile.onSubmit();
    if (this.account) this.account.onSubmit();
    if (this.emailNotifications) this.emailNotifications.onSubmit();
  }
  onBackMenu() {
    let body = document.getElementsByTagName("body")[0];
    body.classList.remove("backMenu"); //remove the class
    body.classList.add("backMenu");
  }
}
