import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractsTableItemComponent } from './contracts-table-item.component';

describe('ContractsTableItemComponent', () => {
  let component: ContractsTableItemComponent;
  let fixture: ComponentFixture<ContractsTableItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractsTableItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractsTableItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
