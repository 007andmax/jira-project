import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-email-setting",
  templateUrl: "./email-setting.component.html",
  styleUrls: ["./email-setting.component.scss"]
})
export class EmailSettingComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
  onBackMenu() {
    let body = document.getElementsByTagName("body")[0];
    body.classList.remove("backMenu"); //remove the class
    body.classList.add("backMenu");
  }
  
}
