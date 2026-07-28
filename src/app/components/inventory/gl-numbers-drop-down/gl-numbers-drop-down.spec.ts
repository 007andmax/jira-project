import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DropDownModule } from '../../shared/drop-down/drop-down.module';
import { MatErrorModule } from '../../shared/mat-error/mat-error.module';
import { GlNumbersDropDownComponent } from './gl-numbers-drop-down.component';



describe('GlNumbersDropDownComponent unit test', () => {
  let component: GlNumbersDropDownComponent;
  let fixture: ComponentFixture<GlNumbersDropDownComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule,
        DropDownModule,
        NgbModule,
        MatErrorModule,
        HttpClientModule,
        ToastrModule.forRoot({
          closeButton: true,
          timeOut: 5000,
          onActivateTick: true
        }),
        NoopAnimationsModule],
      declarations: [GlNumbersDropDownComponent
      ],
    }).compileComponents();

  });

  it('check "getSelectedItemText"', () => {
    const fixture = TestBed.createComponent(GlNumbersDropDownComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.getSelectedItemText()).toEqual("");
  });
});