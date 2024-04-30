import { Component, ElementRef, Injector, OnInit, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { PostCategoryDto, StatisticalServiceProxy, UserPostCountDto, UserScheduleCountDto } from '@shared/service-proxies/service-proxies';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-statistical',
  templateUrl: './statistical.component.html',
  styleUrls: ['./statistical.component.css'],
  providers: [StatisticalServiceProxy]
})
export class StatisticalComponent extends AppComponentBase implements OnInit {
  @ViewChild('pieChart') pieChart: ElementRef;
  @ViewChild('lineChart') lineChart: ElementRef;
  @ViewChild('barChart') barChart: ElementRef;
  chart: any;

  countUser: number;
  countPost: number;
  countBook: number;
  countPostLike: number;

  ctPost: PostCategoryDto[];
  labels: any;
  counts: any;
  scheduleCounts: any;

  userPostCounts: UserPostCountDto[];
  userScheduleCounts: UserScheduleCountDto[];

  isLoading = false;

  constructor(
    injector: Injector,
    public _statisticalService: StatisticalServiceProxy
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.getTotalData();
    this.getScheduleCountByMonth();
    this.getCategoryPost();
    this.getPostCountByMonth();
  }

  getTotalData(): void {
    this.isLoading = true;
    this._statisticalService.getTotalPost().subscribe((data) => {
      this.countPost = data.totalPost;
      this.isLoading = false;
    })
    this._statisticalService.getTotalUser().subscribe((data) => {
      this.countUser = data.totalUser;
      this.isLoading = false;
    })
    this._statisticalService.getTotalPostLike().subscribe((data) => {
      this.countPostLike = data.totalPostLike;
      this.isLoading = false;
    })
    this._statisticalService.getTotalBooking().subscribe((data) => {
      this.countBook = data.totalBooking;
      this.isLoading = false;
    })
    this._statisticalService.getUserWithMostPosts().subscribe((data) => {
      this.userPostCounts = [data];
      this.isLoading = false;
    })

    this._statisticalService.getUserWithMostSchedules().subscribe((data) => {
      this.userScheduleCounts = [data];
      this.isLoading = false;
    })
  }

  // BAR CHART
  getScheduleCountByMonth(): void {
    this.isLoading = true;
    this._statisticalService.getScheduleCountByMonth().subscribe((data) => {
      this.scheduleCounts = data;
      this.createBarChart();
      this.isLoading = false;
    });
  }

  createBarChart(): void {
    const labels = this.scheduleCounts.map(e => 'Tháng ' + e.month);
    const successfulCounts = this.scheduleCounts.map(e => e.successfulCount);
    const cancelledByHostCounts = this.scheduleCounts.map(e => e.cancelledByHostCount);
    const cancelledByTenantCounts = this.scheduleCounts.map(e => e.cancelledByTenantCount);

    this.chart = new Chart(this.barChart.nativeElement, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Lịch hẹn thành công',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
            data: successfulCounts
          },
          {
            label: 'Lịch hẹn bị hủy bởi Chủ trọ',
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
            data: cancelledByHostCounts
          },
          {
            label: 'Lịch hẹn bị hủy bởi Người thuê trọ',
            backgroundColor: 'rgba(255, 206, 86, 0.5)',
            borderColor: 'rgba(255, 206, 86, 1)',
            borderWidth: 1,
            data: cancelledByTenantCounts
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          xAxes: [{ stacked: false }],
          yAxes: [{ stacked: false }]
        }
      }
    });
  }
  /// LINE CHART
  getPostCountByMonth(): void {
    this.isLoading = true;
    this._statisticalService.getPostCountByMonth().subscribe((data) => {
      this.labels = data.map(e => 'Tháng ' + e.month);
      this.counts = data.map(e => e.postCount);
      this.createLineChart(this.labels, this.counts);
    });
    this.isLoading = false;
  }
  createLineChart(labels: String[], counts: number[]): void {
    this.chart = new Chart(this.lineChart.nativeElement, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Số lượng bài đăng',
          data: counts,
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      },
      options: {
        responsive: true
      }
    });
  }

  /// PIE CHART
  getCategoryPost(): void {
    this.isLoading = true;
    this._statisticalService.getPostCountByCategory().subscribe((data) => {
      this.labels = data.map(e => e.priceCategory);
      this.counts = data.map(e => e.count);
      this.createPieChart(this.labels, this.counts);
      this.isLoading = false;
    })
  }
  createPieChart(labels: String[], counts: number[]): void {
    this.chart = new Chart(this.pieChart.nativeElement, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: counts,
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)',
            // Thêm các màu khác nếu cần thiết
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            // Thêm các màu khác nếu cần thiết
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
      }
    });
  }
}
