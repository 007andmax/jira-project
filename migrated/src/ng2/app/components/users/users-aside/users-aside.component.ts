import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-users-aside',
  templateUrl: './users-aside.component.html',
  styleUrls: ['./users-aside.component.scss']
})
export class UsersAsideComponent implements OnInit {
  public opened = true;

  constructor() { }

  ngOnInit() {
  }
}
