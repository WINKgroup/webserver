import http from 'http'
import _ from "lodash"
import express from 'express'
import jwt from 'jsonwebtoken'
import path from 'path'
import { Server as IOServer } from "socket.io"

interface Endpoint {
    path: string
    router: express.Router
}

export interface WebserverConfig {
    name?: string
    port?: number
    ip?: string
    hasSocket?: boolean
    useEndpoints?: Endpoint[]
    rejectUnauthorized?: boolean
    hashedAdminPassword?: string
    jwtSecret?: string
}

export default class Webserver {
    name: string
    app:express.Express
    server:http.Server
    ip:string
    port:number
    ioApp?:IOServer
    hashedAdminPassword:string
    jwtSecret:string

    constructor(inputConfig?:WebserverConfig) {
        const config = _.defaults(inputConfig, {
            name: "Anonymous Webserver",
            port: 8080,
            ip: '127.0.0.1',
            hasSocket: false,
            useEndpoints: [] as Endpoint[],
            rejectUnauthorized: true,
            hashedAdminPassword: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918',  // sha256('admin')
            jwtSecret: 'jwtSecret'
        })
        this.name = config.name
        this.ip = config.ip
        this.port = config.port
        this.hashedAdminPassword = config.hashedAdminPassword
        this.jwtSecret = config.jwtSecret

        if (!config.rejectUnauthorized) process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
        this.app = express()
        this.app.use( express.json() )

        this.app.use(function(req, res, next) {
            res.header("Access-Control-Allow-Origin", "*")
            res.header("Access-Control-Allow-Headers", "Version, Access-Control-Allow-Origin, Authorization, Origin, X-Requested-With, Content-Type, Accept, ETag, Cache-Control, If-None-Match")
            res.header("Access-Control-Expose-Headers", "Etag, Authorization, Origin, X-Requested-With, Content-Type, Accept, If-None-Match, Access-Control-Allow-Origin")
            res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS, PATCH")
            next()
        })

        this.app.get('/server', (req, res) => {
            res.send(`${this.name} server up and running!`)
        })

        this.setupLoginEndpoint()

        config.useEndpoints.map(
            endpoint => {
                this.app.use( endpoint.path, endpoint.router )
            }
        )

        this.server = http.createServer(this.app)
        if (config.hasSocket) {
            this.ioApp = new IOServer(this.server, {
                cors: {
                    origin: true
                }
            })
        }
    }

    protected setupLoginEndpoint() {
        this.app.post('/login', (req, res) => {
            const pwdHash = req.body.pwdHash
            if (pwdHash === this.hashedAdminPassword )
                res.send( jwt.sign({ user: req.body.username }, this.jwtSecret ) )
                else res.status(403).send('wrong password')
        })
    }

    getBaseUrl() {
        return `http://${this.ip}:${this.port}`
    }

    mountUi() {
        this.app.use(express.static("ui"))
        this.app.get("/*", (req, res) => {
            res.sendFile(path.normalize(path.join(__dirname, "..", "ui", "index.html")))
        })
    }

    listen() {
        return new Promise<void>( resolve => {
            this.server.listen(this.port, this.ip, () => {
                console.info((new Date()) + ` ${this.name} server is listening at ${ this.ip }:${ this.port }`)
                resolve()
            })
        } )
    }

    close() {
        console.info(`Shutting down ${this.name} server...`)
        return new Promise<void>( (resolve, reject) => {
            this.server.close( (err) => {
                if (!err) resolve()
                    else reject(err)
            })
        })
    }
}