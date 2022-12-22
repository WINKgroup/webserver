/// <reference types="node" />
import http from 'http';
import express from 'express';
import { Server as IOServer } from "socket.io";
interface Endpoint {
    path: string;
    router: express.Router;
}
export interface WebserverConfig {
    name?: string;
    port?: number;
    ip?: string;
    hasSocket?: boolean;
    useEndpoints?: Endpoint[];
    rejectUnauthorized?: boolean;
    hashedAdminPassword?: string;
    jwtSecret?: string;
}
export default class Webserver {
    name: string;
    app: express.Express;
    server: http.Server;
    ip: string;
    port: number;
    ioApp?: IOServer;
    hashedAdminPassword: string;
    jwtSecret: string;
    constructor(inputConfig?: WebserverConfig);
    protected setupLoginEndpoint(): void;
    getBaseUrl(): string;
    mountUi(): void;
    listen(): Promise<void>;
    close(): Promise<void>;
}
export {};
