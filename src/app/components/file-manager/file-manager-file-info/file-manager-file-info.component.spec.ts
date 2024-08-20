import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileManagerFileInfoComponent } from './file-manager-file-info.component';

describe('FileManagerFileInfoComponent', () => {
  let component: FileManagerFileInfoComponent;
  let fixture: ComponentFixture<FileManagerFileInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FileManagerFileInfoComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileManagerFileInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
