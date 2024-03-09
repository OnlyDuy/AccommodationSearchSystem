import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppScheduleComponent } from './app-schedule.component';

describe('AppScheduleComponent', () => {
  let component: AppScheduleComponent;
  let fixture: ComponentFixture<AppScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppScheduleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
