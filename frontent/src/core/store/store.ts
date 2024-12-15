type UserInfo = {
    name: string;
    email: string;
};

class Store {
    private state: { userInfo: UserInfo | null; loggedIn: boolean } = { userInfo: null, loggedIn: false };
    private listeners: Array<() => void> = [];

    public getState() {
        return this.state;
    }

    public setUserInfo(userInfo: UserInfo) {
        this.state.userInfo = { ...userInfo };
        this.state.loggedIn = true;
        this.notifyListeners();
    }

    public clearUserInfo() {
        this.state.userInfo = null;
        this.state.loggedIn = false;
        this.notifyListeners();
    }

    public subscribe(listener: () => void) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    private notifyListeners() {
        this.listeners.forEach(listener => listener());
    }

    public async login(credentials: { email: string, password: string }) {
        try {
            const response = await fetch('http://localhost:8080/login', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials)
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const userInfo = await response.json();
            this.setUserInfo({
                name: userInfo.name,
                email: userInfo.email
            });

            return true;
        } catch (error) {
            console.error('Login error:', error);
            return false;
        }
    }
}

export const store = new Store();