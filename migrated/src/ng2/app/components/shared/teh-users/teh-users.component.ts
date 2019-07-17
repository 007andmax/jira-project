import { Component, OnInit } from '@angular/core';
import { TehUsersService } from 'src/ng2/app/services/teh-users/teh-users.service';

@Component({
  selector: 'app-teh-users',
  templateUrl: './teh-users.component.html',
  styleUrls: ['./teh-users.component.scss']
})
export class TehUsersComponent implements OnInit {
  public usersList = [];
  public showSelect = false;
  constructor(private tehService:TehUsersService) { }

  ngOnInit() {
    this.tehService.getUsersList().subscribe((data:any) => {
      this.usersList = data.filter(item => item.accountType === 'TECH' && !item.deletedAt);
      console.log('usersList',this.usersList);
    })
  }

    /**
   * show selecct wrapper
   */
  public showSelectWrapper($event) {
    this.showSelect = !this.showSelect;
    this.stopEvent($event);
  }
 
  /**
   * stop event
   */
  private stopEvent($event) {
    $event.preventDefault();
    $event.stopPropagation();
  }

  public trackByIndex(index, item) {
    return index;
  }
}
