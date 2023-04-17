import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { script } from '../../class/device';
import { TerminalService } from '../../_services/terminal.service';
import { first } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'terminal-script-detail',
  templateUrl: './terminal-script-detail.component.html',
  styleUrls: ['./terminal-script-detail.component.scss']
})
export class TerminalScriptDetailComponent implements OnInit {
  @Input() scriptDetailModal: script = {
    title: '',
    type: '',
    command: '',
    default: false,
    id: '',
    category: '',
    categoryId: '',
    typeName: '',
    description: ''
  };
  @Input() scriptDetail = false;
  @Input() loading = false;
  @Input() lineNumberDetail = [1];
  @Input() showDescription = false;
  @Input() cmdCategoryReadList = [];
  @Input() submitted = false;
  @Input() getCommandList: Function;
  @Output() onEmptyScriptDetail = new EventEmitter();
  @Output() onCloneScript = new EventEmitter();
  @Output() onCopyScriptToggle = new EventEmitter();
  constructor(private terminalService: TerminalService,
    private toastr: ToastrService,) { }

  ngOnInit() {
  }
  emptyScriptDetail() {
    this.onEmptyScriptDetail.emit(null);
  }
  setScriptDetail(name, id) {
    this.scriptDetailModal.category = name;
    this.scriptDetailModal.categoryId = id;
  }
  toggleDetailTerminal(type, typeName) {
    this.scriptDetailModal.type = type;
    this.scriptDetailModal.typeName = typeName;
  }
  countLineNumberDetail() {
    var text = $("#cmd_detail textarea").val().toString();
    var lines = text.split(/\r*\n/);
    var count = lines.length;
    this.lineNumberDetail = [];
    for (let index = 0; index < count; index++) {
      this.lineNumberDetail[index] = index + 1;
    }
    $('#cmd_detail_line').scrollTop($('#cmd_detail textarea').scrollTop());
  }
  updateMyScript() {
    let id = '';
    let arr = this.cmdCategoryReadList.filter(val => val.name === this.scriptDetailModal.category);
    if (arr.length > 0) {
      id = arr[0].id;
    }
    if (id !== '') {
      let data = {
        title: this.scriptDetailModal.title,
        categoryId: this.scriptDetailModal.categoryId !== undefined ? this.scriptDetailModal.categoryId : id,
        command: this.scriptDetailModal.command,
        id: this.scriptDetailModal.id,
        type: this.scriptDetailModal.type,
        description: this.scriptDetailModal.description
      }
      this.terminalService.updateCommand(data)
        .pipe(first())
        .subscribe(resp => {
          this.loading = false;
          if (resp.id !== '') {
            this.toastr.success('Command Updated Successfully');
            this.scriptDetail = !this.scriptDetail;
            this.getCommandList();
          }
        },
          error => {
            const statusError = error;
            this.loading = false;
          });
    }
  }
  copyScriptToggle(data, type) {
    this.onCopyScriptToggle.emit({ data, type });
  }
  cloneScript(data) {
    this.onCloneScript.emit(data);
  }
}
