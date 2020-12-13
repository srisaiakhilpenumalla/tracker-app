import { Component, OnInit } from '@angular/core';
import { DataServiceService } from 'src/app/services/data-service.service';
import { GlobalDataSummary } from 'src/app/models/global-data';
import { DateWiseData } from 'src/app/models/date-wise-data';
import { GoogleChartInterface } from 'ng2-google-charts';
import { animation } from '@angular/animations';
import { merge } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.css'],
})
export class CountriesComponent implements OnInit {
  data: GlobalDataSummary[] = [];
  countries: string[] = [];
  totalConfirmed: number = 0;
  totalActive: number = 0;
  totalDeaths: number = 0;
  totalRecovered: number = 0;
  dateWiseData = 0;
  loading = true;
  selectedCountryData: DateWiseData[] | undefined;
  lineChart: GoogleChartInterface = {
    chartType: 'LineChart',
  };

  constructor(private service: DataServiceService) {}

  ngOnInit(): void {
    merge(
      this.service.getDateWiseData().pipe(
        map((result) => {
          this.dateWiseData = result;
        })
      ),
      this.service.getGlobalData().pipe(
        map((result) => {
          this.data = result;
          this.data.forEach((cs) => {
            this.countries.push(cs.country);
          });
        })
      )
    ).subscribe({
      complete: () => {
        this.updateValues('India');
        this.loading = false;
        // this.selectedCountryData = this.dateWiseData['India'];
        // this.updateChart();
      },
    });
  }

  updateChart() {
    let datatable = [];
    datatable.push(['Date', 'Cases']);
    this.selectedCountryData.forEach((cs) => {
      datatable.push([cs.date, cs.cases]);
    });

    this.lineChart = {
      chartType: 'LineChart',
      dataTable: datatable,
      options: {
        height: 500,
        animation: {
          duration: 1000,
          easing: 'out',
        },
      },
    };
  }

  updateValues(country: string) {
    console.log(country);
    this.data.forEach((cs) => {
      if (cs.country == country) {
        this.totalActive = cs.active;
        this.totalConfirmed = cs.confirmed;
        this.totalDeaths = cs.deaths;
        this.totalRecovered = cs.recovered;
      }
    });
    this.selectedCountryData = this.dateWiseData[country];
    console.log(this.selectedCountryData);
    this.updateChart();
  }
}
