import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersAsideDetailDocumentsComponent } from './users-aside-detail-documents.component';

describe('UsersAsideDetailDocumentsComponent', () => {
  let component: UsersAsideDetailDocumentsComponent;
  let fixture: ComponentFixture<UsersAsideDetailDocumentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UsersAsideDetailDocumentsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersAsideDetailDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
