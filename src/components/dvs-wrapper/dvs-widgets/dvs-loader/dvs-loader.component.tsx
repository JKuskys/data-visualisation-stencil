import { Component, h } from '@stencil/core';

@Component({
  tag: 'dvs-loader-component',
  styleUrl: 'dvs-loader.component.css',
})
export class LoaderComponent {

  render() {
    return <div class="loader"></div>;
  }
}
