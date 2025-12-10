import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCardsAddComponent } from './manage-cards-add.component';

describe('ManageCardsAddComponent', () => {
  let component: ManageCardsAddComponent;
  let fixture: ComponentFixture<ManageCardsAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageCardsAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageCardsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
