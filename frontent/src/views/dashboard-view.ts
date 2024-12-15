import { html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { TailwindElement } from "../shared/tailwind.element";
import { store } from "../core/store/store";

@customElement('dashboard-view')
export class DashboardView extends TailwindElement() {
    @state()
    private userInfo = store.getState().userInfo;

    connectedCallback() {
        super.connectedCallback();
        store.subscribe(() => {
            this.userInfo = store.getState().userInfo;
            this.requestUpdate();
        });
    }

    override render() {
        return html`
        <div class="container mx-auto  p-8">
        <h1>My Super Secret Dashboard</h1>
        <p>Welcome, ${this.userInfo.name}!</p>
        </div>
    `;
    }
}