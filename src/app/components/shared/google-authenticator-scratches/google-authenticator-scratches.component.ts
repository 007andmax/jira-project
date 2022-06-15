import { Component, OnInit } from '@angular/core';
import { SettingService } from 'src/app/services/setting/setting.service';

@Component({
  selector: 'google-authenticator-scratches',
  templateUrl: './google-authenticator-scratches.component.html',
  styleUrls: ['./google-authenticator-scratches.component.scss']
})
export class GoogleAuthenticatorScratchesComponent implements OnInit {
  scratchCodes = [];
  constructor(private settingService: SettingService,) { }

  ngOnInit() {
    this.settingService.getScratches().subscribe((data: any) => {
      console.log("data", data);
      this.scratchCodes = data.scratchCodes;
    })
  }
  getNewCodes() {
    this.settingService.getNewScratches().subscribe((data: any) => {
      console.log("data", data);
      this.scratchCodes = data.scratchCodes;
    })
  }
}
