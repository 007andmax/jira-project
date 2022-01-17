import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketSettingsPageComponent } from './ticket-settings-page.component';

describe('TicketSettingsPageComponent', () => {
  let component: TicketSettingsPageComponent;
  let fixture: ComponentFixture<TicketSettingsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketSettingsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketSettingsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
