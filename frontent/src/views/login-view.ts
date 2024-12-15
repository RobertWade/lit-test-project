import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import '../components/login/form.component';

@customElement('login-view')
export class LoginView extends LitElement {
    override render() {
        return html`
            <login-form-component></login-form-component>
        `;
    }
}