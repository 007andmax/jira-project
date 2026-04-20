import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { GlNumbersDropDownModule } from 'src/app/components/inventory/gl-numbers-drop-down/gl-numbers-drop-down.module';
import { DropDownModule } from 'src/app/components/shared/drop-down/drop-down.module';
import { MatErrorModule } from 'src/app/components/shared/mat-error/mat-error.module';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FileManagementAddFileDragDropComponent } from './file-manager-add-file-drag-drop.component';


describe('FileManagementAddFileDragDropComponent unit test', () => {
  let component: FileManagementAddFileDragDropComponent;
  let fixture: ComponentFixture<FileManagementAddFileDragDropComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [CommonModule,
        FormsModule,
        MatErrorModule,
        HttpClientModule,
        ToastrModule.forRoot({
            closeButton: true,
            timeOut: 5000,
            onActivateTick: true
        }),
        NoopAnimationsModule, FileManagementAddFileDragDropComponent],
}).compileComponents();

  });
  it('check "removeFile"', () => {
    const fixture = TestBed.createComponent(FileManagementAddFileDragDropComponent);
    const com = fixture.debugElement.componentInstance;
    com.removeFile();
    expect(com.files.length).toEqual(0);
    expect(com.idfiles.length).toEqual(0);
  });
  it('check "retryFile"', () => {
    const fixture = TestBed.createComponent(FileManagementAddFileDragDropComponent);
    const com = fixture.debugElement.componentInstance;
    com.retryFile();
    expect(com.files.length).toEqual(0);
    expect(com.idfiles.length).toEqual(0);
    expect(com.isError).toEqual(false);
  });
  it('check "parseSize"', () => {
    const fixture = TestBed.createComponent(FileManagementAddFileDragDropComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.parseSize(100)).toEqual('100 B');
  });
});