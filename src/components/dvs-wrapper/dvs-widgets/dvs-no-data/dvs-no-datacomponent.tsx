import { Component, h, Host } from '@stencil/core';

@Component({
  tag: 'dvs-no-data-component',
  styleUrl: 'dvs-no-data.component.css',
})
export class NoDataComponent {

  render() {
    return <Host>Nerasta duomenu</Host>;
  }
}
