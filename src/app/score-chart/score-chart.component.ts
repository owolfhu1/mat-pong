import { Component, OnInit } from '@angular/core';
import { URL } from '../../constants'
import * as CanvasJS from '../canvasjs.min';

@Component({
  selector: 'app-score-chart',
  templateUrl: './score-chart.component.html',
  styleUrls: ['./score-chart.component.css']
})
export class ScoreChartComponent implements OnInit {
  selected;
  dataList = [];
  names = [];

  constructor() { }

  ngOnInit() {
    setTimeout(() => this.getAll());
  }

  delayRender() {
    setTimeout(() => {
      this.renderList();
    }, 350);
  }

  renderList() {
    this.selected = null;
    const data = [];
    this.dataList.forEach(obj => {
      data.push({ ...obj,
        type: 'line',
        axisYtype: 'secondary',
        showInLegend: true,
        markerSize: 5,
        yValueFormatString: '#,###',
        xValueFormatString: 'MMM D h:mm tt',
        lineThickness: 3,
        click: () => {
          this.focus(obj.name);
        }
      });
    });
    const chart = new CanvasJS.Chart('chartContainer', {
      animationEnabled: true,
      theme: 'dark2',
      backgroundColor: '#424242',
      title: {
        text: 'All Scores'
      },
      zoomEnabled: true,
      toolTip: {
        contentFormatter: data => {
          const dataPoint = data.entries[0].dataPoint;
          return `
            <div style="text-align: center">
              <h2>${dataPoint.name} - ${dataPoint.y}</h2>
              <p>${dataPoint.x}</p>
              <p>${dataPoint.game.playerOne}(${dataPoint.game.scoreOne}) vs ${dataPoint.game.playerTwo}(${dataPoint.game.scoreTwo})</p>
              <p>old score: ${dataPoint.old}</p>
            </div>
          `;
        }
      },
      axisX: {
        valueFormatString: 'MMM DD',
        tickThickness: 0,
        lineThickness: 0,
        gridThickness: 0,
      },
      axisY: {
        tickThickness: 0,
        lineThickness: 0,
        gridThickness: 0,
        includeZero: false
      },
      legend: {
        cursor: 'pointer',
        verticalAlign: 'top',
        horizontalAlign: 'center',
        dockInsidePlotArea: true,
      },
      data,
    });
    chart.render();
  }

  focus(name) {
    this.selected = name;
    const obj = {
      type: 'line',
      axisYtype: 'secondary',
      markerSize: 0,
      yValueFormatString: '#,###',
      xValueFormatString: 'MMM D h:mm tt',
      name: '',
      dataPoints: [],
      lineThickness: 3,
    };
    this.dataList.forEach(data => {
      if (data.name === this.selected) {
        obj.name = data.name;
        obj.dataPoints = data.dataPoints;
      }
    });
    const chart = new CanvasJS.Chart('chartContainer', {
      animationEnabled: true,
      theme: 'dark1',
      backgroundColor: '#424242',
      title: {
        text: this.selected + `'s Scores`,
      },
      axisX: {
        valueFormatString: 'MMM DD',
        tickThickness: 0,
        lineThickness: 0,
        gridThickness: 0,
      },
      axisY: {
        gridThickness: 0,
        includeZero: false,
        tickThickness: 0,
        lineThickness: 0,
      },
      zoomEnabled: true,
      toolTip: {
        contentFormatter: data => {
          const dataPoint = data.entries[0].dataPoint;
          return `
            <div style="text-align: center">
              <h2>${dataPoint.y}</h2>
              <p>${dataPoint.x}</p>
              <p>${dataPoint.game.playerOne}(${dataPoint.game.scoreOne}) vs ${dataPoint.game.playerTwo}(${dataPoint.game.scoreTwo})</p>
              <p>old score: ${dataPoint.old}</p>
            </div>
          `;
        }
      },
      data: [ obj ],
    });
    chart.render();
  }

  getAll() {
    fetch(URL + 'charts/all', {mode: 'cors'}).then(res => res.json())
      .then(result => {
        this.names = [];
        result.forEach(set => {
          this.names.push(set.name);
          set.dataPoints.forEach(point => point.x = new Date(point.x));
        });
        this.dataList = result;
        this.renderList();
      });
  }
}
