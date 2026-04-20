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
import { KeyUpEnterModule } from 'src/app/directives/key-up-enter/key-up-enter.module';
import { MatChipListModule } from '../shared/mat-chip-list/mat-chip-list.module';
import { MatChipModule } from '../shared/mat-chip/mat-chip.module';
import { MatFormFieldModule } from '../shared/mat-form-field/mat-form-field.module';
import { PreloaderTicketModule } from '../shared/preloader-ticket/preloader-ticket.module';
import { FileManagerCategoryRenameComponent } from './file-manager-category-rename/file-manager-category-rename.component';
import { FileManagementFileInfoModule } from './file-manager-file-info/file-manager-file-info.module';
import { FileManagementHeaderModule } from './file-manager-header/file-manager-header.module';
import { FileManagementItemCategoryModule } from './file-manager-item-category/file-manager-item-category.module';
import { FileManagementItemFileModule } from './file-manager-item-file/file-manager-item-file.module';
import { FileManagementRoutingModule } from './file-manager-routing.module';
import { FileManagerComponent } from './file-manager.component';
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

describe('FileManagerComponent unit test', () => {
  let component: FileManagerComponent;
  let fixture: ComponentFixture<FileManagerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [CommonModule,
        FileManagementRoutingModule,
        FormsModule,
        DisabledBtnModule,
        PreloaderTicketModule,
        NgbModule,
        FileManagementItemCategoryModule,
        FileManagementItemFileModule,
        FileManagementHeaderModule,
        ReactiveFormsModule,
        MatChipModule,
        MatFormFieldModule,
        MatChipListModule,
        TextAreaModule,
        KeyUpEnterModule,
        FileManagementFileInfoModule,
        HttpClientModule,
        RouterTestingModule,
        ToastrModule.forRoot({
            closeButton: true,
            timeOut: 5000,
            onActivateTick: true
        }),
        NoopAnimationsModule, FileManagerComponent, FileManagerCategoryRenameComponent],
    providers: [{ provide: Router, useValue: mockRouter }],
}).compileComponents();

  });
  it('check "onCategoryInfo"', () => {
    const fixture = TestBed.createComponent(FileManagerComponent);
    const com = fixture.debugElement.componentInstance;
    com.onCategoryInfo({ id: 1, name: 'Category 1' });
    expect(com.cateforyInfo).toEqual({ id: 1, name: 'Category 1' });
  });
  it('check "onFileInfo"', () => {
    const fixture = TestBed.createComponent(FileManagerComponent);
    const com = fixture.debugElement.componentInstance;
    com.onFileInfo({ id: 1, name: 'Category 1' });
    expect(com.fileInfo).toEqual({ id: 1, name: 'Category 1' });
  });
  it('check "onToggleFileInfo"', () => {
    const fixture = TestBed.createComponent(FileManagerComponent);
    const com = fixture.debugElement.componentInstance;
    com.onToggleFileInfo(true);
    expect(com.toggleFileInfo).toEqual(true);
  });

});