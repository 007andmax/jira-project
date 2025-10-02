import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketDetailTasksItemComponent } from './ticket-detail-tasks-item.component';

describe('TicketDetailTasksItemComponent', () => {
  let component: TicketDetailTasksItemComponent;
  let fixture: ComponentFixture<TicketDetailTasksItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TicketDetailTasksItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TicketDetailTasksItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
