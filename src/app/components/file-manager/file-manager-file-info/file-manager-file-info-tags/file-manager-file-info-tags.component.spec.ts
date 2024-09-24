import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileManagerFileInfoTagsComponent } from './file-manager-file-info-tags.component';

describe('FileManagerFileInfoTagsComponent', () => {
  let component: FileManagerFileInfoTagsComponent;
  let fixture: ComponentFixture<FileManagerFileInfoTagsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FileManagerFileInfoTagsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileManagerFileInfoTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
