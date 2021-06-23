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
  @Input() editorContent = "";
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

    //  var editor = CodeMirror(document.getElementById("froala-editor"));
  }
  ngDoCheck() {
    this.onChangeContent.emit(this.editorContent);
  }
  onInitFloara() {
    const self = this;
    this.options = {
      heightMin: 1123,
      toolbarSticky: false,
      saveParam: 'file',
      // Set the save URL.
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
      imageMaxSize: 4 * 1024 * 1024,

      // Allow to upload PNG and JPG.
      imageAllowedTypes: ['jpeg', 'jpg', 'png'],


      filesManagerUploadURL: self.apiUrl + 'file?isAvatar=false&documentFile=true',
      filesManagerUploadParams: {
        id: 'my_editor'
      },
      filesManagerMaxSize: 1024 * 1024 * 4,



      fileUpload: true,
      fileUploadURL: self.apiUrl + 'file?isAvatar=false&documentFile=true',
      fileUploadParams: {
        id: 'my_editor'
      },
      fileUploadMethod: 'POST',
      fileMaxSize: 1024 * 1024 * 4,
      fileAllowedTypes: ['*'],


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
        },
        'file.beforeUpload': function (files) {
          // Return false if you want to stop the file upload.
          console.log(files);
        },
        'file.uploaded': function (response) {
          // File was uploaded to the server.
          console.log(response);
        },
        'file.inserted': function ($file, response) {
          console.log($file);
          $file[0].href = `${$file[0]}/attachment`;
          console.log(response);
          // File was inserted in the editor.
        },

      }
    };
  }



}
