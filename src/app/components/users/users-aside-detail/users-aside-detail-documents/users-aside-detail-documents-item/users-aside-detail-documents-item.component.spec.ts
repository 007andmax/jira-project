import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersAsideDetailDocumentsItemComponent } from './users-aside-detail-documents-item.component';

describe('UsersAsideDetailDocumentsItemComponent', () => {
  let component: UsersAsideDetailDocumentsItemComponent;
  let fixture: ComponentFixture<UsersAsideDetailDocumentsItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersAsideDetailDocumentsItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersAsideDetailDocumentsItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
