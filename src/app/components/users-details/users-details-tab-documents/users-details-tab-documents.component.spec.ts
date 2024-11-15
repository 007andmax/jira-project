import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersDetailsTabDocumentsComponent } from './users-details-tab-documents.component';

describe('UsersDetailsTabDocumentsComponent', () => {
  let component: UsersDetailsTabDocumentsComponent;
  let fixture: ComponentFixture<UsersDetailsTabDocumentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersDetailsTabDocumentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersDetailsTabDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
