import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { UploadAreaProgressModule } from 'src/app/components/shared/upload-area/upload-area-progress/upload-area-progress.module';
import { TicketDetailProfileFormUpdateHeaderComponent } from '../ticket-detail-profile-form-update-header/ticket-detail-profile-form-update-header.component';
import { TicketDetailProfileFormUpdateNoteComponent } from './ticket-detail-profile-form-update-note.component';

describe('TicketDetailProfileFormUpdateNoteComponent unit test', () => {
  let component: TicketDetailProfileFormUpdateNoteComponent;
  let fixture: ComponentFixture<TicketDetailProfileFormUpdateNoteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule,
        NgbModule,
        FormsModule,
        UploadAreaProgressModule,
        AngularEditorModule,
        HttpClientModule,
        ToastrModule.forRoot({
          closeButton: true,
          timeOut: 5000,
          onActivateTick: true
        })
      ],
      declarations: [TicketDetailProfileFormUpdateNoteComponent
      ],
    }).compileComponents();

  });

  it('check "formatBytes"', () => {
    const fixture = TestBed.createComponent(TicketDetailProfileFormUpdateNoteComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.formatBytes(1024)).toEqual("1 KB");
  });
});