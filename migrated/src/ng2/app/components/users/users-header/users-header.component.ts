import {Component, OnInit} from '@angular/core';
import { UsersStateService } from 'src/ng2/app/states/users/users-state.service';

@Component({
  selector: 'app-users-header',
  templateUrl: './users-header.component.html',
  styleUrls: ['./users-header.component.scss']
})
export class UsersHeaderComponent implements OnInit {
count:number = 0;
  constructor(private usersStateService:UsersStateService) {
  }

  ngOnInit() {
    this.usersStateService.getOnCount().subscribe(data => {
      this.count = data;
    })
  }

}
