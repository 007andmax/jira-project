import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MergeTicketsItemComponent } from './merge-tickets-item.component';

describe('MergeTicketsItemComponent', () => {
  let component: MergeTicketsItemComponent;
  let fixture: ComponentFixture<MergeTicketsItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MergeTicketsItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MergeTicketsItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
