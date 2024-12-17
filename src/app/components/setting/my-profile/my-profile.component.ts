import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { SettingStateService } from "src/app/states/setting/setting-state.service";
import { AccountComponent } from "./account/account.component";
import { ActivityHistoryComponent } from "./activity-history/activity-history.component";
import { EmailNotificationsComponent } from "./email-notifications/email-notifications.component";
import { ProfileComponent } from "./profile/profile.component";
import { TicketsMyProfileComponent } from "./tickets-my-profile/tickets-my-profile.component";
import { CustomerPortalStateService } from "src/app/states/customer-portal/customer-portal-state.service";
import { fadeInAnimation } from "src/app/animations";
declare var $: any;

@Component({
  selector: "app-my-profile",
  templateUrl: "./my-profile.component.html",
  animations: [fadeInAnimation],
  // attach the fade in animation to the host (root) element of this component
  host: { '[@fadeInAnimation]': '' },
  styleUrls: ["./my-profile.component.scss"]
})
export class MyProfileComponent implements OnInit, OnDestroy {
  activeTab: string = "profile";
  @ViewChild('profile', { static: true }) profile: ProfileComponent;
  @ViewChild('account', { static: true }) account: AccountComponent;
  @ViewChild('emailNotifications') emailNotifications: EmailNotificationsComponent;
  @ViewChild('activityHistory') activityHistory: ActivityHistoryComponent;
  @ViewChild('tickets') tickets: TicketsMyProfileComponent;
  constructor(private settingStateService: SettingStateService,
    public customerPortalStateService: CustomerPortalStateService,) { }

  ngOnInit() {
    $('body').addClass('page-settings');
    $('body').removeClass('backMenu');
    $(".loading").css({ "top": "100px", "bottom": "unset" });
    this.settingStateService.setComponentName('MyProfileComponent');
  }

  ngOnDestroy() {
    $('body').removeClass('page-settings');
    $(".loading").css({ "top": "-53px", "bottom": "0" });
  }
  setTab(data) {
    this.activeTab = data['nextId'];
  }
  onSubmit() {
    if (this.profile) this.profile.onSubmit();
    if (this.account) this.account.onSubmit();
    if (this.emailNotifications) this.emailNotifications.onSubmit();
    if (this.tickets) this.tickets.onSubmit();
  }
  onBackMenu() {
    let body = document.getElementsByTagName("body")[0];
    body.classList.remove("backMenu"); //remove the class
    body.classList.add("backMenu");
  }
}
