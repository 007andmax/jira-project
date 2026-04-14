import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetDirectionComponent } from './get-direction.component';

describe('GetDirectionComponent', () => {
  let component: GetDirectionComponent;
  let fixture: ComponentFixture<GetDirectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GetDirectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetDirectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
