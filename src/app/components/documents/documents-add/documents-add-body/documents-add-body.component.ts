import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { environment } from 'src/environments/environment';


declare const Codox: any;
declare const CodeMirror: any;
@Component({
  selector: 'app-documents-add-body',
  templateUrl: './documents-add-body.component.html',
  styleUrls: ['./documents-add-body.component.scss']
})
export class DocumentsAddBodyComponent implements OnInit, OnDestroy {
  private apiUrl = environment.apiUrl;
  @Input() editorContent = "";
  public options: Object;
  codox: any;
  editor: any;
  currentUser: any;
  froalaEditor: any;
  attachments = [];
  @Output() onChangeContent = new EventEmitter<any>();
  @Output() onChangeAttachments = new EventEmitter<any>();
  constructor(private usersStateService: UsersStateService,
    public cd: ChangeDetectorRef,) {
    this.codox = new Codox()
  }


  ngOnInit() {
    this.currentUser = this.usersStateService.getCurrentUser();
    this.onInitFloara();

    //  var editor = CodeMirror(document.getElementById("froala-editor"));
  }
  ngAfterViewInit() {

    this.cd.detectChanges();
  }
  ngDoCheck() {

    this.onChangeContent.emit(this.editorContent);
  }
  onInitFloara() {
    const self = this;
    this.options = {
      key: "lSA3D-17E4B3A1C2D1H2rXYb1VPUGRHYZNRJd1JVOOb1HAc1zG2B1A2A2D6B1A1C4G1I4==",
      toolbarButtons: ['fullscreen', 'undo', 'redo', 'getPDF', 'print', '|',
        'bold', 'italic', 'underline', 'textColor', 'backgroundColor', 'clearFormatting', '|',
        'alignLeft', 'alignCenter', 'alignRight', 'alignJustify', '|',
        'formatOL', 'formatUL', 'indent', 'outdent', '|',
        'paragraphFormat', '|',
        'fontFamily', '|',
        'fontSize', 'insertFiles', 'insertFile', '|',
        'insertLink', 'insertImage', 'quote', 'insertTable'],
      //  toolbarButtons: ['bold', 'italic', 'underline', 'moreText', '|', 'alignLeft', 'alignCenter', 'formatOLSimple', 'moreParagraph', '|', 'trackChanges', 'markdown', 'insertLink', 'insertFiles', 'moreRich', '|', 'undo', 'redo', 'moreMisc'],
      /*  toolbarButtons: {
          // Key represents the more button from the toolbar.
          moreText: {
            // List of buttons used in the  group.
            buttons: ['bold', 'italic'],
  
            // Alignment of the group in the toolbar.
            align: 'left',
  
  
          },
          moreParagraph: {
            buttons: ['alignLeft', 'alignCenter', 'alignRight', 'alignJustify'],
            align: 'left',
            buttonsVisible: 1
          },
  
  
        },*/

      attribution: false,
      heightMin: 1123,
      toolbarSticky: false,
      saveParam: 'file',
      saveMethod: 'POST',
      saveParams: { id: 'my_editor' },
      imageUploadParam: 'file',
      imageUploadURL: self.apiUrl + 'file?isAvatar=false&documentFile=true&attachmentType=DOCUMENT',
      imageUploadParams: { id: 'my_editor' },
      imageUploadMethod: 'POST',
      imageMaxSize: 4 * 1024 * 1024,
      imageAllowedTypes: ['jpeg', 'jpg', 'png'],
      filesManagerUploadURL: self.apiUrl + 'file?isAvatar=false&documentFile=true&attachmentType=DOCUMENT',
      filesManagerUploadParams: {
        id: 'my_editor'
      },
      filesManagerMaxSize: 1024 * 1024 * 4,
      fileUpload: true,
      fileUploadURL: self.apiUrl + 'file?isAvatar=false&documentFile=true&attachmentType=DOCUMENT',
      fileUploadParams: {
        id: 'my_editor'
      },
      fileUploadMethod: 'POST',
      fileMaxSize: 1024 * 1024 * 4,
      fileAllowedTypes: ['*'],
      events: {
        "initialized": function (data) {
          let config = {
            "docId": "e1626875-8d25-4f98-abd8-abfdd7010d81",
            "user": { "name": `${self.usersStateService.getCurrentUser().firstName} ${self.usersStateService.getCurrentUser().lastName}` },
            "editor": this,
            "apiKey": "58e429b0-be4a-4cd8-8c8d-9a37fb0adec0",
            "app": "froala",
            "showPointer": true,
            "cursorAlwaysOn": true,
            "pointers": {
              "shape": "arrow"
            }
          };
          //self.codox.init(config);
        },

        'image.uploaded': function ($img) {
          // Do something here.
          // this is the editor instance.
          var file = JSON.parse($img);
          self.attachments.push(file.link);
          self.onChangeAttachments.emit(self.attachments);
          return file;
        },

        'file.uploaded': function (response) {
          var file = JSON.parse(response);
          self.attachments.push(file.link);
          self.onChangeAttachments.emit(self.attachments);
          // File was uploaded to the server.
        },
        'file.inserted': function ($file, response) {
          $file[0].href = `${$file[0]}/attachment`;
          // File was inserted in the editor.
        },
        'filesManager.uploaded': function (response) {
          // Do something here.
          // this is the editor instance.
          var file = JSON.parse(response);
          self.attachments.push(file.link);
          self.onChangeAttachments.emit(self.attachments);
        }
      }
    };
  }
  initialize(initControls) {
    this.froalaEditor = initControls;
    this.froalaEditor.initialize();
  }
  ngOnDestroy(): void {
    this.froalaEditor.destroy();
  }
}
