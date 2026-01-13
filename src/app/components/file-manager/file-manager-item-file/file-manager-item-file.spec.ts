import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GlNumbersDropDownModule } from 'src/app/components/inventory/gl-numbers-drop-down/gl-numbers-drop-down.module';
import { DropDownModule } from 'src/app/components/shared/drop-down/drop-down.module';
import { MatErrorModule } from 'src/app/components/shared/mat-error/mat-error.module';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { DndModule } from 'src/app/directives/dnd/dnd.module';
import { TextAreaModule } from 'src/app/directives/text-area/text-area.module';
import { PreloaderTicketModule } from '../../shared/preloader-ticket/preloader-ticket.module';
import { FileManagerAddCategoryModule } from '../file-manager-add-category/file-manager-add-category.module';
import { FileManagerFileInfoTagsComponent } from '../file-manager-file-info/file-manager-file-info-tags/file-manager-file-info-tags.component';
import { DblclickModule } from 'src/app/directives/dblclick/dblclick.module';
import { FileManagerItemFileComponent } from './file-manager-item-file.component';

describe('FileManagerItemFileComponent unit test', () => {
  let component: FileManagerItemFileComponent;
  let fixture: ComponentFixture<FileManagerItemFileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule,
        FormsModule,
        DisabledBtnModule,
        PreloaderTicketModule,
        NgbModule,
        DblclickModule,
        HttpClientModule,
        ToastrModule.forRoot({
          closeButton: true,
          timeOut: 5000,
          onActivateTick: true
        }),
        NoopAnimationsModule],
      declarations: [FileManagerItemFileComponent
      ],
    }).compileComponents();

  });
  it('check "getTypeFile"', () => {
    const fixture = TestBed.createComponent(FileManagerItemFileComponent);
    const com = fixture.debugElement.componentInstance;
    com.item = { contentType: "application/pdf" };
    expect(com.getTypeFile()).toEqual("PDF");
  });

});