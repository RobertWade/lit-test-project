import { html } from "lit";
import { customElement, state, property } from "lit/decorators.js";
import { TailwindElement } from "../../shared/tailwind.element";
import { store } from "../../core/store/store";
import { router } from "../../core/router/router";


import style from "./form.component.scss?inline";

@customElement("login-form-component")
export class LoginFormComponent extends TailwindElement(style) {
    @state()
    private formData = {
        name: '',
        email: 'test@example.com',
        password: 'dummy'
    };

    private handleInputChange(event: Event) {
        const target = event.target as HTMLInputElement;
        this.formData[target.name as 'email' | 'password'] = target.value;
    }

    @property({ type: Boolean })
    private loggedIn = store.getState().loggedIn;

    @state()
    private error: string = '';

    private async handleLogin(event: Event) {
        event.preventDefault();
        const success = await store.login({
            email: this.formData.email,
            password: this.formData.password
        });

        if (success) {
            router.navigate('/dashboard');
        } else {
            this.error = 'Login fehlgeschlagen';
        }
    }

    override render() {
        if (this.loggedIn) {
            return html`
               <div class="form">
               <h1>Login</h1>
               <p>You are already logged in.</p>
               <button @click=${() => router.navigate('/dashboard')}>Dashboard</button>
               </div>
            `;
        }
        return html`
            <form class="form" @submit=${this.handleLogin}>
                <h1>Login</h1>
                ${this.error ? html`<div class="error">${this.error}</div>` : ''}
                <div>
                    <label for="email">Email:</label>
                    <input type="email" id="email" name="email" 
                           .value=${this.formData.email} @input=${this.handleInputChange} required>
                </div>
                <div>
                    <label for="password">Password:</label>
                    <input type="password" id="password" name="password" 
                           .value=${this.formData.password} @input=${this.handleInputChange} required>
                </div>
                <button type="submit">Login</button>
            </form>
        `;
    }
}