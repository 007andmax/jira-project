import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NumberModule } from 'src/app/directives/number/number.module';
import { ToFixedModule } from 'src/app/directives/to-fixed/to-fixed.module';
import { BillableItemComponent } from './billable-item.component';


describe('BillableItemComponent unit test', () => {
  let component: BillableItemComponent;
  let fixture: ComponentFixture<BillableItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [CommonModule,
        FormsModule,
        HttpClientModule,
        NumberModule,
        ToFixedModule,
        ToastrModule.forRoot({
            closeButton: true,
            timeOut: 5000,
            onActivateTick: true
        }),
        NoopAnimationsModule, BillableItemComponent]
}).compileComponents();

  });

  it('check "parseTotal"', () => {
    const fixture = TestBed.createComponent(BillableItemComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.parseTotal(100)).toEqual("100.00");
  });
  it('check "getStyleAvatar"', () => {
    const fixture = TestBed.createComponent(BillableItemComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.getStyleAvatar(null)).toEqual("");
  });
});