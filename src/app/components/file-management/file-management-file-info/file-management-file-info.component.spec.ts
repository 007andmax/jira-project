import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileManagementFileInfoComponent } from './file-management-file-info.component';

describe('FileManagementFileInfoComponent', () => {
  let component: FileManagementFileInfoComponent;
  let fixture: ComponentFixture<FileManagementFileInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileManagementFileInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileManagementFileInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
