// src/components/shared/link.component.ts
import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { TailwindElement } from "../../shared/tailwind.element";
import { router } from "../../core/router/router";


@customElement("app-link")
export class LinkComponent extends TailwindElement() {
    private unsubscribe?: () => void;

    @property()
    to: string = '/';

    @property()
    activeClass: string = 'text-primary font-bold';

    connectedCallback() {
        super.connectedCallback();
        this.unsubscribe = router.subscribe(() => {
            this.requestUpdate();
        });
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.unsubscribe?.();
    }

    private handleClick(e: Event) {
        e.preventDefault();
        router.navigate(this.to);
    }

    private isActive(): boolean {
        return window.location.pathname === this.to;
    }

    override render() {
        const classes = `
            inline-block transition-colors hover:text-primary/80
            ${this.isActive() ? this.activeClass : ''}
        `;

        return html`
            <a href=${this.to} 
               class=${classes}
               @click=${this.handleClick}>
                <slot></slot>
            </a>
        `;
    }
}