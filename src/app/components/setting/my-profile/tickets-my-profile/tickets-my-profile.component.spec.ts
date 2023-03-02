import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketsMyProfileComponent } from './tickets-my-profile.component';

describe('TicketsMyProfileComponent', () => {
  let component: TicketsMyProfileComponent;
  let fixture: ComponentFixture<TicketsMyProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketsMyProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketsMyProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
