import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UntypedFormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { TicketDetailProfileUpdatesNoteComponent } from './ticket-detail-profile-updates-note.component';
import { TicketDetailProfileUpdatesHeaderInfoComponent } from '../ticket-detail-profile-updates-header-info/ticket-detail-profile-updates-header-info.component';
import { TicketDetailProfileUpdatesNoteItemComponent } from './ticket-detail-profile-updates-note-item/ticket-detail-profile-updates-note-item.component';
import { DynamicTooltipModule } from 'src/app/components/shared/dynamic-tooltip/dynamic-tooltip.module';
import { TicketDetailProfileUpdatesNoteInfoComponent } from './ticket-detail-profile-updates-note-info/ticket-detail-profile-updates-note-info.component';
import { TicketDetailProfileUpdatesNoteEditComponent } from './ticket-detail-profile-updates-note-edit/ticket-detail-profile-updates-note-edit.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { TicketsListService } from '../../../services/tickets-list.service';

describe('TicketDetailProfileUpdatesNoteComponent unit test', () => {
  let component: TicketDetailProfileUpdatesNoteComponent;
  let fixture: ComponentFixture<TicketDetailProfileUpdatesNoteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [CommonModule,
        FormsModule,
        HttpClientModule,
        ToastrModule.forRoot({
            closeButton: true,
            timeOut: 5000,
            onActivateTick: true
        }),
        CommonModule,
        NgbModule,
        DynamicTooltipModule,
        AngularEditorModule,
        NoopAnimationsModule, TicketDetailProfileUpdatesNoteComponent,
        TicketDetailProfileUpdatesHeaderInfoComponent,
        TicketDetailProfileUpdatesNoteItemComponent,
        TicketDetailProfileUpdatesNoteEditComponent],
    declarations: [TicketDetailProfileUpdatesNoteInfoComponent],
    providers: [UntypedFormBuilder, TicketsListService]
}).compileComponents();

  });

  it('check "formatBytes"', () => {
    const fixture = TestBed.createComponent(TicketDetailProfileUpdatesNoteComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.formatBytes(1024)).toEqual("1 KB");
  });
});