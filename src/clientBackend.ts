import axios from 'axios';
import HexEncoder from 'crypto-js/enc-hex';
import sha256 from 'crypto-js/sha256';

export default class Backend {
    baseUrl: string;
    protected token = '';
    protected isTokenLoaded = false;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    getToken() {
        if (!this.isTokenLoaded)
            this.token = window.localStorage.getItem('token') || '';
        this.isTokenLoaded = true;
        return this.token;
    }

    async loginHashedPassword(pwdHash: string, username = 'admin') {
        try {
            const response = await axios.post(`${this.baseUrl}/login`, {
                pwdHash: pwdHash,
            });
            this.token = response.data;
            window.localStorage.setItem('token', this.token);
            return true;
        } catch (e) {
            return false;
        }
    }

    login(password: string, username = 'admin') {
        const pwdHash = sha256(password).toString(HexEncoder);
        return this.loginHashedPassword(pwdHash, username);
    }

    async logout() {
        this.token = '';
        window.localStorage.removeItem('token');
    }

    async get(path: string, addBaseUrl = true) {
        const url = addBaseUrl ? `${this.baseUrl}${path}` : path;
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${this.getToken()}`,
            },
        });
        return response;
    }

    async post(path: string, data: any, addBaseUrl = true) {
        const url = addBaseUrl ? `${this.baseUrl}${path}` : path;
        const response = await axios.post(url, data, {
            headers: {
                Authorization: `Bearer ${this.getToken()}`,
            },
        });
        return response;
    }

    async put(path: string, data: any) {
        const response = await axios.put(`${this.baseUrl}${path}`, data, {
            headers: {
                Authorization: `Bearer ${this.getToken()}`,
            },
        });
        return response;
    }

    async patch(path: string, data: any) {
        const response = await axios.patch(`${this.baseUrl}${path}`, data, {
            headers: {
                Authorization: `Bearer ${this.getToken()}`,
            },
        });
        return response;
    }

    async delete(path: string) {
        await axios.delete(`${this.baseUrl}${path}`, {
            headers: {
                Authorization: `Bearer ${this.getToken()}`,
            },
        });
    }

    async materialTable<Model>(path: string, query: object) {
        const response = await axios.post(`${this.baseUrl}${path}`, query, {
            headers: {
                Authorization: `Bearer ${this.getToken()}`,
            },
        });

        return {
            data: response.data.data as Model[],
            page: response.data.page,
            totalCount: response.data.totalCount,
        };
    }
}
