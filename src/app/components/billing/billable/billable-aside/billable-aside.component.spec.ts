import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillableAsideComponent } from './billable-aside.component';

describe('BillableAsideComponent', () => {
  let component: BillableAsideComponent;
  let fixture: ComponentFixture<BillableAsideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillableAsideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillableAsideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
