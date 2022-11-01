import { Component, Input, OnInit } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { SignatureService } from 'src/app/services/signature/signature.service';

@Component({
  selector: 'add-signature',
  templateUrl: './add-signature.component.html',
  styleUrls: ['./add-signature.component.scss']
})
export class AddSignatureComponent implements OnInit {
  messageContent: string = '';
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: false,
    height: '100%',
    minHeight: '5rem',
    width: 'auto',
    minWidth: '0',
    translate: 'no',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Write your draft for companies',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    toolbarPosition: 'bottom',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' }
    ],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    uploadUrl: 'v1/image',
    sanitize: false,
  };
  @Input() signatureDrop: NgbDropdown;
  constructor(private signatureService: SignatureService) { }

  ngOnInit() {
  }
  close() {
    this.messageContent = '';
    this.signatureDrop.close();
  }
  save() {
    this.signatureService.setSignature(this.messageContent).subscribe(data => {
      this.messageContent = '';
      this.signatureDrop.close();
    });
  }
}
