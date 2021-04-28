import { Component, OnInit, SimpleChanges } from '@angular/core';
import FroalaEditor from 'froala-editor';
import { UsersStateService } from 'src/app/states/users/users-state.service';


@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent implements OnInit {


  constructor(private usersStateService: UsersStateService) {

  }

  ngOnInit() {

  }
}
