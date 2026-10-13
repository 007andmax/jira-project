import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

@Component({
  providers: [provideNgxMask()],
  standalone: true,
  imports: [FormsModule, CommonModule, NgxMaskDirective],
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
