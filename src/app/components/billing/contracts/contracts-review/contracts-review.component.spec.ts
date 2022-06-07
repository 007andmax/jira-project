import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractsReviewComponent } from './contracts-review.component';

describe('ContractsReviewComponent', () => {
  let component: ContractsReviewComponent;
  let fixture: ComponentFixture<ContractsReviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractsReviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractsReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
