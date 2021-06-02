import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DocumentsService } from 'src/app/services/documents/documents.service';
import { LeftPanelStateService } from 'src/app/states/left-panel/left-panel-state.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { DocumentAdd } from './class/document-add';
import { DocumentValidate } from './class/document-validate';

@Component({
  selector: 'app-documents-add',
  templateUrl: './documents-add.component.html',
  styleUrls: ['./documents-add.component.scss']
})
export class DocumentsAddComponent implements OnInit {
  openAside: boolean = true;
  currentUser: any;
  showPreloader: boolean = true;
  documentValidate: DocumentValidate = new DocumentValidate();
  documentAdd: DocumentAdd = new DocumentAdd();
  constructor(private usersStateService: UsersStateService,
    public activateRoute: ActivatedRoute,
    public documentsService: DocumentsService,
    public leftPanelStateService: LeftPanelStateService) { }

  ngOnInit() {
    this.leftPanelStateService.changeStateWithoutNavigate('new-add-documents');
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
