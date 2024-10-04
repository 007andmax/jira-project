import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { DropDownComponent } from 'src/app/components/shared/drop-down/drop-down.component';
import { TitleListType } from 'src/app/components/tickets/tickets/tickets-header/class/title-list-type';
import { UsersService } from 'src/app/services/users/users.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';

@Component({
  selector: 'tickets-my-profile',
  templateUrl: './tickets-my-profile.component.html',
  styleUrls: ['./tickets-my-profile.component.scss']
})
export class TicketsMyProfileComponent implements OnInit {
  selectedDefaulPage = new TitleListType("All", "ALL");
  @ViewChild('intervalsDp', { static: true }) intervalsDp: DropDownComponent;
  listDefaultPages = [new TitleListType("All Tickets", "ALL"),
  new TitleListType("Unassigned Tickets", "UNASSIGNED"),
  new TitleListType("My Tickets", "MY_TICKETS"),
  //new TitleListType("Shared", "SHARED"),
  new TitleListType("Open Tickets", "OPEN"),
  new TitleListType("Closed Tickets", "CLOSED"),
  new TitleListType("Trash Tickets", "TRASH"),
  new TitleListType("Spam Tickets", "SPAM")];
  public currentUser: any;
  loading = true;
  sub: Subscription = new Subscription();
  constructor(private usersStateService: UsersStateService,
    private usersService: UsersService) { }

  ngOnInit() {
    if (this.usersStateService.getCurrentUser()) {
      this.currentUser = this.usersStateService.getCurrentUser();
      this.selectedDefaulPage = this.listDefaultPages.find(item => item.type == this.currentUser.startPage);
      this.loading = false;
    }
    let getOnGetCurrentuser = this.usersStateService.getOnGetCurrentuser().subscribe(data => {
      this.currentUser = data;
      this.selectedDefaulPage = this.listDefaultPages.find(item => item.type == this.currentUser.startPage);
      this.loading = false;
    })
    this.sub.add(getOnGetCurrentuser);
  }
  onChangeDefaultPage(data) {
    this.selectedDefaulPage = data;
  }
  public onSubmit() {
    if (this.selectedDefaulPage.type != this.currentUser.startPage) {
      this.usersService.setDefaultPage(this.selectedDefaulPage.type).subscribe(res => {

      })
    }
  }

}
