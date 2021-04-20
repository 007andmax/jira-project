import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketProfileFormUpdateComponent } from './ticket-profile-form-update.component';

describe('TicketProfileFormUpdateComponent', () => {
  let component: TicketProfileFormUpdateComponent;
  let fixture: ComponentFixture<TicketProfileFormUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketProfileFormUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketProfileFormUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
