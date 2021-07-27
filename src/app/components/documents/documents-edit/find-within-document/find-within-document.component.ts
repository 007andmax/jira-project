import { Component, OnInit } from '@angular/core';
declare const Mark: any;
@Component({
  selector: 'find-within-document',
  templateUrl: './find-within-document.component.html',
  styleUrls: ['./find-within-document.component.scss']
})
export class FindWithinDocumentComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  onSearch(e) {
    var context = document.querySelector("#froala-editor");
    var instance = new Mark(context);
    instance.unmark().mark(e.target.value, {
      acrossElements: true,
      separateWordSearch: false,
    });
  }
}
