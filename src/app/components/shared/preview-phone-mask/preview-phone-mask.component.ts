import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgxMaskModule } from 'ngx-mask';

@Component({
  standalone: true,
  imports: [FormsModule, CommonModule, NgxMaskModule.forRoot()],
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
