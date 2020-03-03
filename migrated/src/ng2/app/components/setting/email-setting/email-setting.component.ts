import { Component, OnInit, OnDestroy } from "@angular/core";
declare var $:any;
@Component({
  selector: "app-email-setting",
  templateUrl: "./email-setting.component.html",
  styleUrls: ["./email-setting.component.scss"]
})
export class EmailSettingComponent implements OnInit, OnDestroy {
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
