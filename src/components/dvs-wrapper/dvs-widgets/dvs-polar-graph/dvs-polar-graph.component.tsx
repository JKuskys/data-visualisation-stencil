import { Component, Element, h, Prop, Watch } from '@stencil/core';
import { IWidgetData } from '../../models/widget-data.interface';

import Chart from 'chart.js/auto';
import { ChartOptions } from 'chart.js';
import { GraphDefaultColors } from '../../models/default-colors.enum';

@Component({
  tag: 'dvs-polar-graph-component',
  styleUrl: 'dvs-polar-graph.component.css',
})
export class PolarGraphComponent {
  @Prop() width: number = 200;
  @Prop() height: number = 140;

  @Prop()
  widgetData: IWidgetData;
  @Watch('widgetData')
  protected dataWatcher(newData: IWidgetData): void {
    this.myChartInstance.data.labels = newData?.data.map(item => item.label);

    this.myChartInstance.data?.datasets.forEach((dataset: any) => {
      dataset.data = newData?.data.map(item => item.value);
      dataset.backgroundColor = newData?.data.map((_, index) => this.getColor(index));
    });

    this.myChartInstance.options = this.getOptions(newData);

    this.myChartInstance.update();
  }

  @Element()
  private el: HTMLElement;
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;

  protected myChartInstance: any;

  componentDidLoad() {
    this.canvas = this.el.querySelector('canvas');
    this.canvas.width = this.width - 16;
    this.canvas.height = this.height - 16;

    this.context = this.canvas.getContext('2d');

    const chartOptions: any = {
      type: 'polarArea',
      data: {
        labels: this.widgetData?.data.map(item => item.label),
        datasets: [
          {
            label: this.widgetData.customLegend,
            data: this.widgetData?.data.map(item => item.value),
            backgroundColor: this.widgetData?.data.map((_, index) => this.getColor(index)),
            borderWidth: 1,
          },
        ],
      },

      options: this.getOptions(this.widgetData),
    };

    this.myChartInstance = new Chart(this.context, chartOptions);
  }

  render() {
    return <canvas width={this.width - 16} height={this.height - 16}></canvas>;
  }

  private getOptions(widget: IWidgetData): ChartOptions {
    return {
      animation: {
        duration: 0,
      },
      plugins: { legend: { display: !!widget.customLegend }, title: { display: !!widget.title, text: widget.title } },
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          display: false,
        },

        y: {
          display: false,
        },
      },
    };
  }

  private getColor(index: number): string {
    if (index % 3 === 0) {
      return this.widgetData.customNegativeSecondaryColor ?? GraphDefaultColors.SecondaryRed;
    }

    if (index % 2 === 0) {
      return this.widgetData.customSecondaryColor ?? GraphDefaultColors.SecondaryBlue;
    }

    return this.widgetData.customPrimaryColor ?? GraphDefaultColors.PrimaryBlue;
  }
}
