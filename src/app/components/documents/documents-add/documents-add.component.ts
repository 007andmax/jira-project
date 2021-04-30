import { Component, OnInit } from '@angular/core';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { DocumentAdd } from './class/document-add';

@Component({
  selector: 'app-documents-add',
  templateUrl: './documents-add.component.html',
  styleUrls: ['./documents-add.component.scss']
})
export class DocumentsAddComponent implements OnInit {
  currentUser: any;
  showPreloader: boolean = true;
  documentAdd: DocumentAdd = new DocumentAdd();
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
  onChangeContent(data) {
    this.documentAdd.setContent(data);
  }
}
