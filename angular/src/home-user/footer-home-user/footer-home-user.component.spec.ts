import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterHomeUserComponent } from './footer-home-user.component';

describe('FooterHomeUserComponent', () => {
  let component: FooterHomeUserComponent;
  let fixture: ComponentFixture<FooterHomeUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FooterHomeUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterHomeUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
