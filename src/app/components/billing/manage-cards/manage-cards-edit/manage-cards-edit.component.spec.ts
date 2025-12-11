import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCardsEditComponent } from './manage-cards-edit.component';

describe('ManageCardsEditComponent', () => {
  let component: ManageCardsEditComponent;
  let fixture: ComponentFixture<ManageCardsEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageCardsEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageCardsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
