import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('not-found-view')
export class NotFoundView extends LitElement {
    override render() {
        return html`<h1>Page Not Found</h1>`;
    }
}