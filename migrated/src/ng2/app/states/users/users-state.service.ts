import { Injectable, EventEmitter } from '@angular/core';
import { UsersService } from '../../services/users/users.service';

@Injectable({
  providedIn: 'root'
})
export class UsersStateService {
  allUsers = [];
  onGetUsers: EventEmitter<any> = new EventEmitter();
  constructor(private userService: UsersService, ) {

  }
  public onInit() {
   
    this.userService.getAllusers().subscribe((data) => {
    
      this.setAllUsers(data);
      this.onInitGetUsers(data);
    })
  }
  public setAllUsers(data) {
    this.allUsers = data;
  }
  public onInitGetUsers(data) {
    this.onGetUsers.emit(data);
  }
  public getOnUsers() {
    return this.onGetUsers;
  }
  public getAllUsers() {
    return this.allUsers;
  }
}
