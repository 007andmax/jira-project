import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
declare var $: any;
@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss'],
})
export class SettingComponent implements OnInit, OnDestroy {

  constructor() {

  }

  ngOnInit() {
    $('body').addClass('ng7');
    $('body').removeClass('backMenu');
  }

  ngOnDestroy() {
    $('body').removeClass('ng7');
  }

}
