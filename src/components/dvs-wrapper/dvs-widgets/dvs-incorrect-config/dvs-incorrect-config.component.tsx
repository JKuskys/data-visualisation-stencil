import { Component, h, Host } from '@stencil/core';

@Component({
  tag: 'dvs-incorrect-config-component',
  styleUrl: 'dvs-incorrect-config.component.css',
})
export class IncorrectConfigComponent {

  render() {
    return <Host>Neteisinga konfiguracija</Host>;
  }
}
