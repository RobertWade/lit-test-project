import { store } from '../store/store';

type Route = {
    path: string;
    component: string;
    protected?: boolean;
};

class Router {
    private routes: Route[] = [];

    constructor() {
        window.addEventListener('popstate', () => this.handleLocationChange());
    }

    public setRoutes(routes: Route[]) {
        this.routes = routes;
        this.handleLocationChange();
    }

    private handleLocationChange() {
        const path = window.location.pathname;
        const route = this.routes.find(r => r.path === path) || this.routes.find(r => r.path === '(.*)');
        if (route) {
            // Route protection check
            if (route.protected && !store.getState().loggedIn) {
                this.navigate('/');
                return;
            }
            const outlet = document.getElementById('outlet');
            if (outlet) {
                outlet.innerHTML = `<${route.component}></${route.component}>`;
            }
        }
    }

    public navigate(path: string) {
        window.history.pushState({}, '', path);
        this.handleLocationChange();
    }
}

export const router = new Router();

// Routen konfigurieren
router.setRoutes([
    { path: '/', component: 'login-view' },
    { path: '/about', component: 'about-view' },
    { path: '/dashboard', component: 'dashboard-view', protected: true },
    { path: '(.*)', component: 'not-found-view' },
]);