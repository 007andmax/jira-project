import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { ConfirmComponent } from 'src/app/components/shared/confirm/confirm.component';
import { ConfirmStateService } from 'src/app/components/shared/confirm/services/confirm-state.service';
import { DELETE_NOTE_TEMPLATE } from 'src/app/const/confirm';
import { NoteService } from 'src/app/services/note/note.service';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
import { NoteRealTimeService } from 'src/app/states/note/note-real-time.service';
import { NoteStateService } from 'src/app/states/note/note-state.service';
import { NoteTemplate } from './class/note-template';
import { TicketSortBy } from 'src/app/components/tickets/tickets/class/ticket-sort-by';

@Component({
  selector: 'canned-responses',
  templateUrl: './canned-responses.component.html',
  styleUrls: ['./canned-responses.component.scss']
})
export class CannedResponsesComponent implements OnInit {
  loading: boolean = true;
  showPreloader: boolean = true;
  sort = "ASC";
  noteTemplate: Array<NoteTemplate> = [];
  sortBy: TicketSortBy = new TicketSortBy('name', 'ASC');
  sub: Subscription = new Subscription();
  constructor(
    public cd: ChangeDetectorRef,
    private noteService: NoteService,
    private confirmStateService: ConfirmStateService,
    private modalService: NgbModal,
    private noteRealTimeService: NoteRealTimeService,
    private permissionsService: PermissionsService,
    private noteStateService: NoteStateService,) { }

  ngOnInit() {
    this.noteService.getNotesTemplates(this.sort.toLocaleLowerCase()).subscribe((data: any) => {
      this.noteTemplate = data.map(item => new NoteTemplate(item));
      this.noteStateService.setNoteTemplate(this.noteTemplate);
      this.showPreloader = false;
      this.loading = false;
    })
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === DELETE_NOTE_TEMPLATE) {
          this.onRemoveNoteTemplate(this.noteStateService.getNoteTemplateForRemove().id);
        }

      }
    })
    this.sub.add(getConfirm);
    let changeNoteArray = this.noteRealTimeService.changeNoteArray.subscribe(data => {
      if (data.action === "CREATE_TICKET_NOTE_TEMPLATE") {
        this.noteTemplate.push(new NoteTemplate(data.data));
      }
      if (data.action === "EDIT_TICKET_NOTE_TEMPLATE") {
        let index = this.noteTemplate.findIndex(item => item.id === data.data.id);
        if (index > -1) this.noteTemplate[index] = new NoteTemplate(data.data);
      }
      if (data.action === "DELETE_TICKET_NOTE_TEMPLATE") {
        let index = this.noteTemplate.findIndex(item => item.id === data.data);
        if (index > -1) this.noteTemplate.splice(index, 1);
      }
      this.noteTemplate.sort((a, b) => this.sort === 'DESC' ?
        (a.title.toLowerCase() < b.title.toLowerCase()) ? 1 : ((b.title.toLowerCase() < a.title.toLowerCase()) ? -1 : 0) :
        (a.title.toLowerCase() > b.title.toLowerCase()) ? 1 : ((b.title.toLowerCase() > a.title.toLowerCase()) ? -1 : 0));
      this.noteStateService.setNoteTemplate(this.noteTemplate);
      this.cd.detectChanges();
    })
    this.sub.add(changeNoteArray);
  }
  getNoteList() {
    this.showPreloader = true;
    this.noteService.getNotesTemplates(this.sort.toLocaleLowerCase()).subscribe((data: any) => {
      this.noteTemplate = data.map(item => new NoteTemplate(item));
      this.noteStateService.setNoteTemplate(this.noteTemplate);
      this.showPreloader = false;
    })
  }
  sortByName() {
    if (this.sort === 'DESC') {
      this.sort = 'ASC';
      this.getNoteList();
    } else {
      this.sort = 'DESC';
      this.getNoteList();
    }
    this.sortBy.sortBy = 'name';
    this.sortBy.sortDirection = this.sort;
  }
  onRemoveNoteTemplate(id) {
    this.noteService.removeNoteTemplate(id).subscribe(data => {
      this.confirmStateService.initRequest(false);
    }, err => {
      this.confirmStateService.initRequest(false);
    })
  }
  copyNote(data) {
    this.noteService.getNoteTemplate(data.id).subscribe(res => {
      this.noteStateService.copyNote(res);
    })
  }
  editNote(data) {
    this.noteService.getNoteTemplate(data.id).subscribe(res => {
      this.noteStateService.editNote(res);
    })
  }
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }
  removeNote(item) {
    this.confirmStateService.setConfirmAction(DELETE_NOTE_TEMPLATE);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.header = `Delete Canned Response`;
    modalRef.componentInstance.message = `Are you sure you want to delete this canned response?`;
    this.noteStateService.setNoteTemplateForRemove(item);
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
