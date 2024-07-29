import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeftPanelFileManagementComponent } from './left-panel-file-management.component';

describe('LeftPanelFileManagementComponent', () => {
  let component: LeftPanelFileManagementComponent;
  let fixture: ComponentFixture<LeftPanelFileManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeftPanelFileManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeftPanelFileManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
