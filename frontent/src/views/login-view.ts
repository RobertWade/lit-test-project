import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { TailwindElement } from "../shared/tailwind.element";
import '../components/login/form.component';

@customElement('login-view')
export class LoginView extends TailwindElement() {
    override render() {
        return html`
           <div class="min-h-[80vh] min-w-screen flex justify-center items-center ">
            <login-form-component></login-form-component>
           </div>
        `;
    }
}