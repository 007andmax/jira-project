import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { DropDownModule } from 'src/app/components/shared/drop-down/drop-down.module';
import { DynamicTooltipModule } from 'src/app/components/shared/dynamic-tooltip/dynamic-tooltip.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { TaskHeaderAddTypeComponent } from '../../task-header-add/task-header-add-type/task-header-add-type.component';
import { TasksAddAssociateTicketsComponent } from './tasks-add-associate-tickets.component';


describe('TasksAddAssociateTicketsComponent unit test', () => {
  let component: TasksAddAssociateTicketsComponent;
  let fixture: ComponentFixture<TasksAddAssociateTicketsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule,
        FormsModule,
        DropDownModule,
        InfiniteScrollModule,
        DynamicTooltipModule,
        NgbModule,
        HttpClientModule,
        ToastrModule.forRoot({
          closeButton: true,
          timeOut: 5000,
          onActivateTick: true
        }),
        NoopAnimationsModule],
      declarations: [TasksAddAssociateTicketsComponent
      ]
    }).compileComponents();

  });

  it('check "toggleItem"', () => {
    const fixture = TestBed.createComponent(TaskHeaderAddTypeComponent);
    const com = fixture.debugElement.componentInstance;
    com.toggleItem({ id: 1 });
    expect(com.selectedTag).toEqual([{ id: 1 }]);
  });

});