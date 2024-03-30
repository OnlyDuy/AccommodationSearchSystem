import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostViewLikeComponent } from './post-view-like.component';

describe('PostViewLikeComponent', () => {
  let component: PostViewLikeComponent;
  let fixture: ComponentFixture<PostViewLikeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostViewLikeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostViewLikeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
