import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SliderHomeUserComponent } from './slider-home-user.component';

describe('SliderHomeUserComponent', () => {
  let component: SliderHomeUserComponent;
  let fixture: ComponentFixture<SliderHomeUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SliderHomeUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SliderHomeUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
