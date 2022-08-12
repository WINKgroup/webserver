# webserver
a REST web server

## Install
```
npm install @winkgroup/webserver
```

## Usage
```js
import Webserver from '@winkgroup/webserver'

const webserver = new Webserver({ name: 'MyServer' })
webserver.listen()
```

Some config parameters are taken from env file using [Env library](https://www.npmjs.com/package/@winkgroup/env).
In particular you could set a .env with this info:
```
PORT=[xxx]
IP=[xxx]
PWD_HASH=[xxx]
JWT_SECRET=[xxx]
```

## API
### Webserver(config)
This is the main class. `config` object has these attributes:
- name: the display name of the webserver
- port: default is 8080
- ip: default is 127.0.0.1
- hasSocket: enables socket.io endpoint
- useEndpoints: a list of [Endpoints](#endpoint)
- rejectUnauthorized: useful when to want to test https without proper certificate (default is true)

### Endpoint
this is an object used to extend [Webserver](#webserver) with new collections.
It takes two attributes:
- path: the root path for the collection
- router: the `express.Router` object to work with

Tipical usage:
```js

class MyCollection {
    static getRouter() {
        const router = express.Router()
        router.get('/hello', async (req, res) => {
            res.send('hello!!')
        })
    }
}

const myCollectionEndpoints = {
    path: '/mycollection',
    router: MyCollection.getRouter()
}

webserver = new Webserver({ useEndpoints: [ myCollectionEndpoints ] })
webserver.listen()

// GET /mycollection/hello will reply 'hello!!'

```

## Maintainers
* [fairsayan](https://github.com/fairsayan)