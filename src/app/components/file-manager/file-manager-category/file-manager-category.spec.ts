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
import { CompanyTagsModule } from '../../companies/company-tags/company-tags.module';
import { DatePickerModule } from '../../shared/date-picker/date-picker.module';
import { MatChipListModule } from '../../shared/mat-chip-list/mat-chip-list.module';
import { MatChipModule } from '../../shared/mat-chip/mat-chip.module';
import { MatFormFieldModule } from '../../shared/mat-form-field/mat-form-field.module';
import { PreloaderTicketModule } from '../../shared/preloader-ticket/preloader-ticket.module';
import { UploadAreaProgressModule } from '../../shared/upload-area/upload-area-progress/upload-area-progress.module';
import { FileManagementFileInfoModule } from '../file-manager-file-info/file-manager-file-info.module';
import { FileManagementHeaderModule } from '../file-manager-header/file-manager-header.module';
import { FileManagementItemCategoryModule } from '../file-manager-item-category/file-manager-item-category.module';
import { FileManagementItemFileModule } from '../file-manager-item-file/file-manager-item-file.module';
import { FileManagementCategoryRoutingModule } from './file-manager-category-routing.module';
import { FileManagerCategoryComponent } from './file-manager-category.component';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
declare var jasmine;
const mockRouter = {
  navigate: jasmine.createSpy('navigate'),
  routerState: {
    root: {}
  },
  events: of(),
};

describe('FileManagerCategoryComponent unit test', () => {
  let component: FileManagerCategoryComponent;
  let fixture: ComponentFixture<FileManagerCategoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule,
        FileManagementCategoryRoutingModule,
        FormsModule,
        DisabledBtnModule,
        PreloaderTicketModule,
        NgbModule,
        FileManagementItemCategoryModule,
        FileManagementItemFileModule,
        FileManagementHeaderModule,
        FileManagementFileInfoModule,
        HttpClientModule,
        RouterTestingModule,
        ToastrModule.forRoot({
          closeButton: true,
          timeOut: 5000,
          onActivateTick: true
        }),
        NoopAnimationsModule],
      providers: [{ provide: Router, useValue: mockRouter }],
      declarations: [FileManagerCategoryComponent
      ],
    }).compileComponents();

  });
  it('check "onCategoryInfo"', () => {
    const fixture = TestBed.createComponent(FileManagerCategoryComponent);
    const com = fixture.debugElement.componentInstance;
    com.onCategoryInfo({ id: 1, name: 'Category 1' });
    expect(com.cateforyInfo).toEqual({ id: 1, name: 'Category 1' });
  });
  it('check "onFileInfo"', () => {
    const fixture = TestBed.createComponent(FileManagerCategoryComponent);
    const com = fixture.debugElement.componentInstance;
    com.onFileInfo({ id: 1, name: 'Category 1' });
    expect(com.fileInfo).toEqual({ id: 1, name: 'Category 1' });
  });
  it('check "onToggleFileInfo"', () => {
    const fixture = TestBed.createComponent(FileManagerCategoryComponent);
    const com = fixture.debugElement.componentInstance;
    com.onToggleFileInfo(true);
    expect(com.toggleFileInfo).toEqual(true);
  });
});