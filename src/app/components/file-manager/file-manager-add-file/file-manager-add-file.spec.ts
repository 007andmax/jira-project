import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
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
import { FileManagerAddFileComponent } from './file-manager-add-file.component';


describe('FileManagerAddFileComponent unit test', () => {
  let component: FileManagerAddFileComponent;
  let fixture: ComponentFixture<FileManagerAddFileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [CommonModule,
        FormsModule,
        DisabledBtnModule,
        PreloaderTicketModule,
        NgbModule,
        UploadAreaProgressModule,
        MatChipModule,
        MatFormFieldModule,
        MatChipListModule,
        DatePickerModule,
        CompanyTagsModule,
        InfiniteScrollModule,
        DndModule,
        ReactiveFormsModule,
        TextAreaModule,
        MatErrorModule,
        HttpClientModule,
        ToastrModule.forRoot({
            closeButton: true,
            timeOut: 5000,
            onActivateTick: true
        }),
        NoopAnimationsModule, FileManagerAddFileComponent],
    providers: [NgbActiveModal],
}).compileComponents();

  });
  it('check "removeFile"', () => {
    const fixture = TestBed.createComponent(FileManagerAddFileComponent);
    const com = fixture.debugElement.componentInstance;
    com.ngOnInit();
    com.onChangeTags([{ id: 1 }, { id: 2 }]);
    expect(com.addForm.controls["tags"].value).toEqual([{ id: 1 }, { id: 2 }]);
  });
  it('check "removeFile"', () => {
    const fixture = TestBed.createComponent(FileManagerAddFileComponent);
    const com = fixture.debugElement.componentInstance;
    com.ngOnInit();
    com.onChangeFiles({ id: '123', name: 'testfile' });
    expect(com.addForm.controls["mediaFileId"].value).toEqual('123');
    expect(com.addForm.controls["name"].value).toEqual('testfile');
  });
});