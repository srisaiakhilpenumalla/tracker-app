import { Component, OnInit } from '@angular/core';
import { DataServiceService } from 'src/app/services/data-service.service';
import { GlobalDataSummary } from 'src/app/models/global-data';
import { GoogleChartInterface } from 'ng2-google-charts';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  totalConfirmed = 0;
  totalActive = 0;
  totalDeaths = 0;
  totalRecovered = 0;
  datatable: any = [];
  loading = true;
  globalData: GlobalDataSummary[] = [];
  pieChart: GoogleChartInterface = {
    chartType: 'PieChart',
  };
  columnChart: GoogleChartInterface = {
    chartType: 'ColumnChart',
  };

  constructor(private dataService: DataServiceService) {}

  initChart(caseType: string) {
    let value: number | undefined;
    this.datatable = [];
    //datatable.push(['Country', 'Cases']);

    this.globalData.forEach((cs) => {
      if (caseType == 'c') {
        value = cs.confirmed;
      }
      if (caseType == 'r') {
        value = cs.recovered;
      }
      if (caseType == 'a') {
        value = cs.active;
      }
      if (caseType == 'd') {
        value = cs.deaths;
      }
      this.datatable.push([cs.country, value]);
      console.log(this.datatable);
    });
    this.pieChart = {
      chartType: 'PieChart',
      dataTable: this.datatable,
      options: {
        height: 500,
        animation: {
          duration: 1000,
          easing: 'out',
        },
      },
    };
    this.columnChart = {
      chartType: 'ColumnChart',
      dataTable: this.datatable,
      options: {
        height: 500,
        animation: {
          duration: 1000,
          easing: 'out',
        },
      },
    };
  }

  ngOnInit(): void {
    this.dataService.getGlobalData().subscribe({
      next: (result) => {
        //console.log(result);
        this.globalData = result;
        result.forEach((cs) => {
          if (!Number.isNaN(cs.confirmed)) {
            this.totalActive += cs.active;
            this.totalConfirmed += cs.confirmed;
            this.totalDeaths += cs.deaths;
            this.totalRecovered += cs.recovered;
          }
        });
        this.initChart('c');
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
  updateChart(input: HTMLInputElement) {
    //console.log(input.value);
    this.initChart(input.value);
  }
}
