import { Component, OnInit } from '@angular/core';
import { UsersStateService } from 'src/app/states/users/users-state.service';

@Component({
  selector: 'app-documents-add',
  templateUrl: './documents-add.component.html',
  styleUrls: ['./documents-add.component.scss']
})
export class DocumentsAddComponent implements OnInit {
  currentUser: any;
  showPreloader: boolean = true;
  constructor(private usersStateService: UsersStateService) { }

  ngOnInit() {
    if (this.usersStateService.getCurrentUser()) {
      this.currentUser = this.usersStateService.getCurrentUser();
      this.showPreloader = false;
    }
    this.usersStateService.getOnGetCurrentuser().subscribe(data => {
      this.currentUser = data;
      this.showPreloader = false;
    })
  }

}
