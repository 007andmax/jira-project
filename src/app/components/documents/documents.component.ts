import { Component, OnInit, SimpleChanges } from '@angular/core';
import FroalaEditor from 'froala-editor';
declare const Codox: any;

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent implements OnInit {
  editorContent = "<p>Hello, Froala!</p><p>wefwefwf</p><p>wefwefwef</p><p>wefwefwef</p><p>wef</p>";
  public options: Object;
  codox: any;
  editor: any;
  constructor() {
    this.codox = new Codox()
  }

  ngOnInit() {
    const self = this;
    this.options = {
      saveParam: 'body',
      // Set the save URL.
      saveURL: 'http://example.com/save',
      // HTTP request type.
      saveMethod: 'POST',
      // Additional save params.
      saveParams: { id: 'my_editor' },

      events: {
        "initialized": function () {
          let config = {
            "docId": "e1626875-8d25-4f98-abd8-abfdd7010d81",
            "user": { "name": "Semyhran" },
            "editor": this,
            "apiKey": "68cdb48b-a9cf-4859-973d-2ee548671b2a",
            "app": "froala",
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
          console.log($img);
        },
        'image.beforeUpload': function (files) {
          // Do something here.
          // this is the editor instance.
          console.log(files);
        },
        'image.inserted': function (files) {
          // Do something here.
          // this is the editor instance.
          console.log(files);
        }

      }
    };


  }


}
