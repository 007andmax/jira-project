import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { SignatureService } from 'src/app/services/signature/signature.service';

@Component({
  standalone: true,
  imports: [FormsModule, CommonModule],
  selector: 'edit-signature',
  templateUrl: './edit-signature.component.html',
  styleUrls: ['./edit-signature.component.scss']
})
export class EditSignatureComponent implements OnInit {
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
    uploadUrl: 'file?isAvatar=false&isForSignature=true',
    sanitize: false,
  };
  @Input() signatureDrop: NgbDropdown;
  @Output() onEdit = new EventEmitter<any>();
  constructor(private signatureService: SignatureService) { }

  ngOnInit() {
  }
  public onInitedit(data) {
    this.messageContent = JSON.parse(JSON.stringify(data));
  }
  close() {
    this.messageContent = '';
    this.signatureDrop.close();
  }
  save() {
    this.signatureService.editSignature(this.messageContent).subscribe((data: any) => {
      this.onEdit.emit(data.content);
      this.messageContent = '';
      this.signatureDrop.close();
    });
  }
}
