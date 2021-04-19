import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DraftEmailRecipientsComponent } from './draft-email-recipients.component';

describe('DraftEmailRecipientsComponent', () => {
  let component: DraftEmailRecipientsComponent;
  let fixture: ComponentFixture<DraftEmailRecipientsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DraftEmailRecipientsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DraftEmailRecipientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
