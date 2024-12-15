import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('about-view')
export class AboutView extends LitElement {
  override render() {
    return html`<h1>About</h1>`;
  }
}