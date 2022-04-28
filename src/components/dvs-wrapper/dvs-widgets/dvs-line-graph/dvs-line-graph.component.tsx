import { Component, Element, h, Prop, Watch } from '@stencil/core';
import { IWidgetData } from '../../models/widget-data.interface';

import Chart from 'chart.js/auto';
import { ChartOptions } from 'chart.js';
import { GraphDefaultColors } from '../../models/default-colors.enum';

@Component({
  tag: 'dvs-line-graph-component',
  styleUrl: 'dvs-line-graph.component.css',
})
export class LineGraphComponent {
  /**
   * Key of widget configuration
   */
  @Prop() width: number = 200;
  @Prop() height: number = 140;

  @Prop()
  widgetData: IWidgetData;
  @Watch('widgetData')
  protected dataWatcher(newData: IWidgetData): void {
    this.myChartInstance.data.labels = newData?.data.map(item => item.label);

    this.myChartInstance.data?.datasets.forEach((dataset: any) => {
      dataset.data = newData?.data.map(item => item.value);
      dataset.backgroundColor = this.getColors(newData);
    });

    this.myChartInstance.options = this.getOptions(newData)

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
      type: 'line',
      data: {
        labels: this.widgetData?.data.map(item => item.label),
        datasets: [
          {
            label: this.widgetData.customLegend,
            data: this.widgetData?.data.map(item => item.value),
            backgroundColor: this.getColors(this.widgetData),
            borderWidth: 1,
            borderColor: this.widgetData.customSecondaryColor ?? GraphDefaultColors.SecondaryBlue,
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
          grid: {
            display: widget.showXGrid,
          },
          ticks: {
            display: widget.showLabels,
          },
        },

        y: {
          min: widget.min,
          max: widget.max + 10,
          grid: {
            display: widget.showYGrid,
          },
          ticks: {
            display: widget.showPeriods,
          },
        },
      },
    };
  }

  private getColors(widgetData: IWidgetData): string[] {
    let colors: string[] = [];

    widgetData.data.forEach((item, index) => {
      if (index === 0) {
        const primaryColor = widgetData.markFirst
          ? widgetData.customSecondaryColor ?? GraphDefaultColors.SecondaryBlue
          : widgetData.customPrimaryColor ?? GraphDefaultColors.PrimaryBlue;
        const secondaryColor = widgetData.differentNegativeColors
          ? widgetData.markFirst
            ? widgetData.customNegativeSecondaryColor ?? GraphDefaultColors.SecondaryRed
            : widgetData.customNegativePrimaryColor ?? GraphDefaultColors.PrimaryRed
          : primaryColor;
        colors = [...colors, this.getColor(primaryColor, secondaryColor, item.value, widgetData.differentNegativeColors)];
        return;
      }

      if (index === widgetData.data.length - 1) {
        const primaryColor = widgetData.markLast
          ? widgetData.customSecondaryColor ?? GraphDefaultColors.SecondaryBlue
          : widgetData.customPrimaryColor ?? GraphDefaultColors.PrimaryBlue;
        const secondaryColor = widgetData.differentNegativeColors
          ? widgetData.markLast
            ? widgetData.customNegativeSecondaryColor ?? GraphDefaultColors.SecondaryRed
            : widgetData.customNegativePrimaryColor ?? GraphDefaultColors.PrimaryRed
          : primaryColor;
        colors = [...colors, this.getColor(primaryColor, secondaryColor, item.value, widgetData.differentNegativeColors)];
        return;
      }

      const primaryColor = widgetData.customPrimaryColor ?? GraphDefaultColors.PrimaryBlue;
      const secondaryColor = widgetData.differentNegativeColors ? widgetData.customNegativePrimaryColor ?? GraphDefaultColors.PrimaryRed : primaryColor;
      colors = [...colors, this.getColor(primaryColor, secondaryColor, item.value, widgetData.differentNegativeColors)];
    });

    return colors;
  }

  private getColor(positive: string, negative: string, value: number, differentNegativeColors: boolean): string {
    if (differentNegativeColors) {
      return value < 0 ? negative : positive;
    }

    return positive;
  }
}
