import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppScheduleSuccessComponent } from './app-schedule-success.component';

describe('AppScheduleSuccessComponent', () => {
  let component: AppScheduleSuccessComponent;
  let fixture: ComponentFixture<AppScheduleSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppScheduleSuccessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppScheduleSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
