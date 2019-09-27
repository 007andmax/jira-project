import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-company-profile',
  templateUrl: './company-profile.component.html',
  styleUrls: ['./company-profile.component.scss'],
})
export class CompanyProfileComponent implements OnInit {
  log = 14;

  constructor() {}

  ngOnInit() {}

  increaseValue() {
    this.log = this.log + 1;
  }
  decreaseValue() {
    if (this.log > 0) {
      this.log--;
    }
  }
}
