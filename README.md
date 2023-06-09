# webserver
a REST web server helper functions

## Install
```bash
npm install @winkgroup/webserver
```

## Usage
to setup ioServer linked to current server without reject unauthorized:
```js
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const app = express();

prepareApp(app, 'myApp')

const server = http.createServer(app)
this.ioApp = new IOServer(server, {
    cors: {
        origin: true,
    },
});

listen({ server: server, name: 'myApp' });
```

## Maintainers
* [fairsayan](https://github.com/fairsayan)