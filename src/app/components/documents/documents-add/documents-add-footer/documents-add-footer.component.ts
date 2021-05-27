import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DocumentsService } from 'src/app/services/documents/documents.service';
import { LeftPanelStateService } from 'src/app/states/left-panel/left-panel-state.service';
import { DocumentAdd } from '../class/document-add';
import { DocumentValidate } from '../class/document-validate';

@Component({
  selector: 'app-documents-add-footer',
  templateUrl: './documents-add-footer.component.html',
  styleUrls: ['./documents-add-footer.component.scss']
})
export class DocumentsAddFooterComponent implements OnInit {
  @Input() documentAdd: DocumentAdd = new DocumentAdd();
  @Input() documentValidate: DocumentValidate = new DocumentValidate();
  constructor(private documentsService: DocumentsService,
    private leftPanelStateService: LeftPanelStateService,
    private router: Router,) { }

  ngOnInit() {
  }
  add() {
    console.log("documentAdd", this.documentAdd);
    if (!this.documentValidate.isValidate(this.documentAdd)) return;
    this.documentsService.add(this.documentAdd).subscribe(data => {
      this.leftPanelStateService.goToState('new-documents');
    })
  }
}
