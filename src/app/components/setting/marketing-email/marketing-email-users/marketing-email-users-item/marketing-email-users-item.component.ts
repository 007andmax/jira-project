import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from 'src/app/components/users/class/user';

@Component({
  selector: 'marketing-email-users-item',
  templateUrl: './marketing-email-users-item.component.html',
  styleUrls: ['./marketing-email-users-item.component.scss'],

})
export class MarketingEmailUsersItemComponent implements OnInit {
  @Input() user: User;
  @Output() onSelect: EventEmitter<any> = new EventEmitter();
  constructor(public cd: ChangeDetectorRef,) { }

  ngOnInit() {
  }
  selectUser() {
    console.log("selectUser");
    this.user.selected = !this.user.selected;
    this.onSelect.emit(this.user);

  }
  parseNameUser(user) {
    return `${this.user.firstName} ${user.lastName}`;
  }

}
