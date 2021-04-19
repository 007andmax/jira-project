import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DraftEmailUserRecipientsComponent } from './draft-email-user-recipients.component';

describe('DraftEmailUserRecipientsComponent', () => {
  let component: DraftEmailUserRecipientsComponent;
  let fixture: ComponentFixture<DraftEmailUserRecipientsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DraftEmailUserRecipientsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DraftEmailUserRecipientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
