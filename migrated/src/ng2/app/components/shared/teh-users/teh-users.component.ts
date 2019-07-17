import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-teh-users',
  templateUrl: './teh-users.component.html',
  styleUrls: ['./teh-users.component.scss']
})
export class TehUsersComponent implements OnInit {
  public usersList = [];
  public showSelect = false;
  constructor() { }

  ngOnInit() {
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
}
