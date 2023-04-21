import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { scriptModal } from '../../class/device';

@Component({
  selector: 'terminal-run-script',
  templateUrl: './terminal-run-script.component.html',
  styleUrls: ['./terminal-run-script.component.scss']
})
export class TerminalRunScriptComponent implements OnInit {
  @Input() runScript: boolean;
  @Input() myScriptList = [];
  @Input() myScriptListFilter = [];
  @Input() sharedScriptList = [];
  @Input() sharedScriptListFilter = [];
  @Input() cmdCategoryReadList = [];
  myScriptModal: scriptModal = {
    category: '',
    categoryId: '',
    search: ''
  };
  @Input() sharedScriptModal: scriptModal = {
    category: '',
    categoryId: '',
    search: ''
  };
  @Output() onCopyToTerminal = new EventEmitter();
  @Output() onViewScriptDetail = new EventEmitter();
  @Output() onCloneScript = new EventEmitter();
  @Output() onClosed = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }
  copyToTerminal(cmd, type, file) {
    this.onCopyToTerminal.emit({ cmd, type, file })
  }
  filterMyScript(category: any) {
    if (category) {
      this.myScriptModal.category = category.name;
      this.myScriptModal.categoryId = category.id;
    } else {
      this.myScriptModal.category = '';
      this.myScriptModal.categoryId = '';
    }
    console.log("this.myScriptList", this.myScriptList);
    if (this.myScriptModal.search === '' && this.myScriptModal.category === '') {
      this.myScriptListFilter = this.myScriptList;
    } else if (this.myScriptModal.category !== '' && this.myScriptModal.search !== '') {
      this.myScriptListFilter = this.myScriptList.filter(val => val.title.toLowerCase().includes(this.myScriptModal.search.toLowerCase()) && val.categoryId === this.myScriptModal.categoryId);
    } else if (this.myScriptModal.search !== '' && this.myScriptModal.category === '') {
      this.myScriptListFilter = this.myScriptList.filter(val => val.title.toLowerCase().includes(this.myScriptModal.search.toLowerCase()))
    } else if (this.myScriptModal.search === '' && this.myScriptModal.category !== '') {
      this.myScriptListFilter = this.myScriptList.filter(val => val.categoryId === this.myScriptModal.categoryId)
    }
  }
  close() {
    this.onClosed.emit(null);
  }
  filterSharedScript(category: any) {
    if (category) {
      this.sharedScriptModal.category = category.name;
      this.sharedScriptModal.categoryId = category.id;
    } else {
      this.sharedScriptModal.category = '';
      this.sharedScriptModal.categoryId = '';
    }
    if (this.sharedScriptModal.search === '' && this.sharedScriptModal.category === '') {
      this.sharedScriptListFilter = this.sharedScriptList;
    } else if (this.sharedScriptModal.category !== '' && this.sharedScriptModal.search !== '') {
      this.sharedScriptListFilter = this.sharedScriptList.filter(val => val.title.toLowerCase().includes(this.sharedScriptModal.search.toLowerCase()) && val.categoryId === this.sharedScriptModal.categoryId);
    } else if (this.sharedScriptModal.search !== '' && this.sharedScriptModal.category === '') {
      this.sharedScriptListFilter = this.sharedScriptList.filter(val => val.title.toLowerCase().includes(this.sharedScriptModal.search.toLowerCase()))
    } else if (this.sharedScriptModal.search === '' && this.sharedScriptModal.category !== '') {
      this.sharedScriptListFilter = this.sharedScriptList.filter(val => val.categoryId === this.sharedScriptModal.categoryId)
    }
  }
  viewScriptDetail(data) {
    this.onViewScriptDetail.emit(data);
  }
  cloneScript(data) {
    this.onCloneScript.emit(data);
  }
}
