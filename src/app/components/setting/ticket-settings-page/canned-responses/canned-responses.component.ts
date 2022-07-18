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

@Component({
  selector: 'canned-responses',
  templateUrl: './canned-responses.component.html',
  styleUrls: ['./canned-responses.component.scss']
})
export class CannedResponsesComponent implements OnInit {
  showPreloader: boolean = true;
  sort = "ASC";
  noteTemplate: Array<NoteTemplate> = [];
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
    })
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === DELETE_NOTE_TEMPLATE) {
          this.onRemoveIndustry(this.noteStateService.getNoteTemplateForRemove().id);
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
  }
  onRemoveIndustry(id) {
    this.noteService.removeNoteTemplate(id).subscribe(data => {

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
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.message = `Remove Canned Response`;
    this.noteStateService.setNoteTemplateForRemove(item);
  }
  /* sortByTicketName() {
     if (this.sort === 'DESC') {
       this.sort = 'ASC';
       this.ticketsStatus = this.ticketsStateService.getTicketsStatus().sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
         1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));
     } else {
       this.sort = 'DESC';
       this.ticketsStatus.reverse();
     }
   }*/

  ngOnDestroy(): void {

    this.sub.unsubscribe();
  }
}
