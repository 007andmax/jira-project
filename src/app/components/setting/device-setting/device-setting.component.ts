import { Component, OnInit } from '@angular/core';
import { SettingStateService } from 'src/app/states/setting/setting-state.service';

@Component({
  selector: 'device-setting',
  templateUrl: './device-setting.component.html',
  styleUrls: ['./device-setting.component.scss']
})
export class DeviceSettingComponent implements OnInit {
  templeteInfo: any;
  constructor(private settingStateService: SettingStateService) { }

  ngOnInit() {
    $('body').addClass('ng7');
    $('body').removeClass('backMenu');
    this.settingStateService.setComponentName('DeviceSettingComponent');
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
