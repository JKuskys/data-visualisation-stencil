import { Component, Prop, h, State } from '@stencil/core';
import { IWidgetData } from './models/widget-data.interface';

@Component({
  tag: 'dvs-wrapper-component',
  styleUrl: 'dvs-wrapper.component.css',
  shadow: true,
})
export class WrapperComponent {
  /**
   * Key of widget configuration
   */
  @Prop() widgetKey: string;
  @Prop() width: number = 200;
  @Prop() height: number = 140;

  @State() widgetData: IWidgetData;
  @State() isLoading: boolean = true;
  @State() isApiError: boolean = false;

  private dataFetcher;

  async onKeyChanged(key: string) {
    this.dataFetcher = setInterval(async () => {
      await fetch(`https://my-app-8mk4r.ondigitalocean.app/api/v1/widgets/data/${key}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(response => {
          if (response.ok) {
            response.json().then(widgetData => {
              this.widgetData = widgetData;
              this.isLoading = false;
            });
          }
        })
        .catch(() => {
          this.isApiError = true;
          this.isLoading = false;
        });
    }, 3000);
  }

  componentWillLoad() {
    this.onKeyChanged(this.widgetKey);
  }

  disconnectedCallback() {
    console.log('si');
    clearInterval(this.dataFetcher);
  }

  render() {
    return (
      <div>
        <div class={this.classNames} style={{ width: `${this.width}px`, height: `${this.height}px` }}>
          {this.widgetData?.data.length > 0 ? (
            this.widgetData.widgetType === 'bar' ? (
              <dvs-bar-graph-component widgetData={this.widgetData} height={this.height} width={this.width}></dvs-bar-graph-component>
            ) : this.widgetData.widgetType === 'pie' ? (
              <dvs-pie-graph-component widgetData={this.widgetData} height={this.height} width={this.width}></dvs-pie-graph-component>
            ) : this.widgetData.widgetType === 'line' ? (
              <dvs-line-graph-component widgetData={this.widgetData} height={this.height} width={this.width}></dvs-line-graph-component>
            ) : this.widgetData.widgetType === 'polarArea' ? (
              <dvs-polar-graph-component widgetData={this.widgetData} height={this.height} width={this.width}></dvs-polar-graph-component>
            ) : (
              <dvs-incorrect-config-component></dvs-incorrect-config-component>
            )
          ) : this.isLoading ? (
            <dvs-loader-component></dvs-loader-component>
          ) : this.isApiError ? (
            <dvs-incorrect-config-component></dvs-incorrect-config-component>
          ) : (
            <dvs-no-data-component></dvs-no-data-component>
          )}
        </div>
      </div>
    );
  }

  private get classNames(): { [className: string]: boolean } {
    return {
      'widget-container': true,
      'widget-container--actionable': true,
    };
  }
}
