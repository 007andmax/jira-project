import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileManagementHeaderComponent } from './file-management-header.component';

describe('FileManagementHeaderComponent', () => {
  let component: FileManagementHeaderComponent;
  let fixture: ComponentFixture<FileManagementHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileManagementHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileManagementHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
