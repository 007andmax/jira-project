import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { environment } from 'src/environments/environment';


declare const Codox: any;
declare const CodeMirror: any;
@Component({
  selector: 'app-documents-add-body',
  templateUrl: './documents-add-body.component.html',
  styleUrls: ['./documents-add-body.component.scss']
})
export class DocumentsAddBodyComponent implements OnInit {
  private apiUrl = environment.apiUrl;
  @Input() editorContent = "<p>Hello, Froala!</p><p>wefwefwf</p><p>wefwefwef</p><p>wefwefwef</p><p>wef</p>";
  public options: Object;
  codox: any;
  editor: any;
  currentUser: any;
  @Output() onChangeContent = new EventEmitter<any>();
  constructor(private usersStateService: UsersStateService) {
    this.codox = new Codox()
  }

  ngOnInit() {
    this.currentUser = this.usersStateService.getCurrentUser();
    this.onInitFloara();
    console.log('document.getElementById("froala-editor")', document.getElementById("froala-editor"));
    //  var editor = CodeMirror(document.getElementById("froala-editor"));
  }
  ngDoCheck() {
    this.onChangeContent.emit(this.editorContent);
  }
  onInitFloara() {
    const self = this;
    this.options = {
      heightMin: 1123,
      saveParam: 'file',
      // Set the save URL.
      //  saveURL: self.apiUrl + 'file?isAvatar=false',
      // HTTP request type.
      saveMethod: 'POST',
      // Additional save params.
      saveParams: { id: 'my_editor' },


      imageUploadParam: 'file',

      // Set the image upload URL.
      imageUploadURL: self.apiUrl + 'file?isAvatar=false&documentFile=true',

      // Additional upload params.
      imageUploadParams: { id: 'my_editor' },

      // Set request type.
      imageUploadMethod: 'POST',

      // Set max image size to 5MB.
      imageMaxSize: 5 * 1024 * 1024,

      // Allow to upload PNG and JPG.
      imageAllowedTypes: ['jpeg', 'jpg', 'png'],

      codeMirror: true,
      codeMirrorOptions: {
        indentWithTabs: true,
        lineNumbers: true,
        lineWrapping: true,
        mode: 'text/html',
        tabMode: 'indent',
        tabSize: 4
      },
      events: {
        "initialized": function () {
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
          //start!
          self.codox.init(config);

        },
        'save.before': function (e, editor) {
          // Before save request is made.
          console.log(editor);
        },

        'save.after': function (e, editor) {
          // After successfully save request.
          console.log(editor);
        },

        'save.error': function (e, editor) {
          // Do something here.
          console.log(editor);
        },
        'image.beforePasteUpload': function (img) {
          // Do something here.
          // this is the editor instance.
          console.log(img);
        },
        'image.loaded': function ($img) {
          // Do something here.
          // this is the editor instance.
          console.log($img);
        },
        'image.uploaded': function ($img) {
          // Do something here.
          // this is the editor instance.
          var img = JSON.parse($img);
          console.log(img);
          return img;

        },
        'image.beforeUpload': function (files) {
          // Do something here.
          // this is the editor instance.
          console.log(files);
        },
        'image.inserted': function (files, response) {
          // Do something here.
          // this is the editor instance.
          console.log(files);
          console.log(response);
        }

      }
    };
  }



}
