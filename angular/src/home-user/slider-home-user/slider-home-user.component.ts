import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-slider-home-user',
  templateUrl: './slider-home-user.component.html',
  styleUrls: ['./slider-home-user.component.css']
})
export class SliderHomeUserComponent implements OnInit {
  currentSlideIndex: number = 0;
  slideInterval: any;

  constructor() { }

  ngOnInit(): void {
    this.showSlide(this.currentSlideIndex);
    this.startSlideShow();
  }

  ngOnDestroy(): void {
    this.stopSlideShow();
  }

  showSlide(index: number): void {
    const slides: HTMLElement[] = Array.from(document.querySelectorAll('.slide'));
    slides.forEach((slide, i) => {
      slide.classList.remove('active');
      if (i === index) {
        slide.classList.add('active');
      }
    });
  }

  moveSlide(n: number): void {
    const slides: HTMLElement[] = Array.from(document.querySelectorAll('.slide'));
    this.currentSlideIndex = (this.currentSlideIndex + n + slides.length) % slides.length;
    this.showSlide(this.currentSlideIndex);
  }

  // autoSlide
  startSlideShow(): void {
    this.slideInterval = setInterval(() => {
      this.moveSlide(1);
    }, 5000);
  }

  stopSlideShow(): void {
    if(this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }
}
