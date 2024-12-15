import { html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { TailwindElement } from "../../shared/tailwind.element";
import { router } from "../../core/router/router";
import { store } from "../../core/store/store";
import '../shared/link.component';

import style from "./nav.component.scss?inline";

@customElement("nav-component")
export class NavComponent extends TailwindElement(style) {
  @state()
  private userInfo = store.getState().userInfo;

  connectedCallback() {
    super.connectedCallback();
    store.subscribe(() => {
      this.userInfo = store.getState().userInfo;
      this.loggedIn = store.getState().loggedIn;
      this.requestUpdate();
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  @property({ type: Number })
  count = 0;

  // loggedIn State from store
  @state()
  private loggedIn = store.getState().loggedIn;

  private navigate(event: Event) {
    event.preventDefault();
    const target = event.target as HTMLAnchorElement;
    router.navigate(target.getAttribute('href')!);
  }

  override render() {
    return html`
    <nav class="">
      <div class="container mx-auto flex justify-between px-8">
        <div class="flex gap-2">
        <app-link to="/">
        Home
        </app-link>
          <!-- <a href="/about" @click=${this.navigate}>About</a> -->
        </div>
          <a href="/" @click=${this.userInfo ? null : this.navigate}>
            ${this.loggedIn ? `Willkommen, ${this.userInfo.name}` : 'Login'}
          </a>
      </div>
    </nav>
  `;
  }
}