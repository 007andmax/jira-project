import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersDetailsTabDocumentsItemComponent } from './users-details-tab-documents-item.component';

describe('UsersDetailsTabDocumentsItemComponent', () => {
  let component: UsersDetailsTabDocumentsItemComponent;
  let fixture: ComponentFixture<UsersDetailsTabDocumentsItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersDetailsTabDocumentsItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersDetailsTabDocumentsItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
