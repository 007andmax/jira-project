import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'preview-phone-mask',
  templateUrl: './preview-phone-mask.component.html',
  styleUrls: ['./preview-phone-mask.component.scss']
})
export class PreviewPhoneMaskComponent implements OnInit {
  @Input() number!: string;
  @Input() class!: string;
  constructor() { }

  ngOnInit() {
  }

}
