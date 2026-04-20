import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { scriptModal } from '../../class/device';
import { NgIf, NgFor } from '@angular/common';
import { DropDownComponent } from '../../../shared/drop-down/drop-down.component';
import { FormsModule } from '@angular/forms';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'terminal-run-script',
    templateUrl: './terminal-run-script.component.html',
    styleUrls: ['./terminal-run-script.component.scss'],
    standalone: true,
    imports: [NgbNavModule, FormsModule, DropDownComponent, NgIf, NgFor]
})
export class TerminalRunScriptComponent implements OnInit {
  @Input() runScript: boolean;
  @Input() myScriptList = [];
  @Input() myScriptListFilter = [];
  @Input() sharedScriptList = [];
  @Input() sharedScriptListFilter = [];
  @Input() cmdCategoryReadList = [];
  myScriptModal: scriptModal = {
    categoryId: '',
    search: ''
  };
  @Input() sharedScriptModal: scriptModal = {
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
      this.myScriptModal.categoryId = category.id;
    } else {
      this.myScriptModal.categoryId = '';
    }
    if (this.myScriptModal.search === '' && !category) {
      this.myScriptListFilter = this.myScriptList;
    } else if (category && this.myScriptModal.search !== '') {
      this.myScriptListFilter = this.myScriptList.filter(val => val.title.toLowerCase().includes(this.myScriptModal.search.toLowerCase()) && val.categoryId === this.myScriptModal.categoryId);
    } else if (this.myScriptModal.search !== '' && !category) {
      this.myScriptListFilter = this.myScriptList.filter(val => val.title.toLowerCase().includes(this.myScriptModal.search.toLowerCase()))
    } else if (this.myScriptModal.search === '' && category) {
      this.myScriptListFilter = this.myScriptList.filter(val => val.categoryId === this.myScriptModal.categoryId)
    }
  }
  close() {
    this.onClosed.emit(null);
  }
  filterSharedScript(category: any) {
    if (category) {
      this.sharedScriptModal.categoryId = category.id;
    } else {
      this.sharedScriptModal.categoryId = '';
    }
    if (this.sharedScriptModal.search === '' && !category) {
      this.sharedScriptListFilter = this.sharedScriptList;
    } else if (category && this.sharedScriptModal.search !== '') {
      this.sharedScriptListFilter = this.sharedScriptList.filter(val => val.title.toLowerCase().includes(this.sharedScriptModal.search.toLowerCase()) && val.categoryId === this.sharedScriptModal.categoryId);
    } else if (this.sharedScriptModal.search !== '' && !category) {
      this.sharedScriptListFilter = this.sharedScriptList.filter(val => val.title.toLowerCase().includes(this.sharedScriptModal.search.toLowerCase()))
    } else if (this.sharedScriptModal.search === '' && category) {
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
