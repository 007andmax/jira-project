import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MergeTicketsComponent } from './merge-tickets.component';

describe('MergeTicketsComponent', () => {
  let component: MergeTicketsComponent;
  let fixture: ComponentFixture<MergeTicketsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MergeTicketsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MergeTicketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
