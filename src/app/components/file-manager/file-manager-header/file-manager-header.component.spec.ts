import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileManagerHeaderComponent } from './file-manager-header.component';

describe('FileManagerHeaderComponent', () => {
  let component: FileManagerHeaderComponent;
  let fixture: ComponentFixture<FileManagerHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FileManagerHeaderComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileManagerHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
