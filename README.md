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

## API
### Webserver(config)
This is the main class. `config` object has these attributes:
- name: the display name of the webserver
- port: default is 8080
- ip: default is 127.0.0.1
- hasSocket: enables socket.io endpoint
- useEndpoints: a list of [Endpoints](#endpoint)
- rejectUnauthorized: useful when to want to test https without proper certificate (default is true)
- hashedAdminPassword: admin password already hashed (default is "admin" with hash in sha256)
- jwtSecret: secret word to salt jwt (default: jwtSecret)

Express object is accessible through the attribute *app*:
```js
    const webserver = new Webserver()
    // webserver.app is the Express object
```

Endpoints:
`POST /login`
this is a really simple endpoint. It verifies provided pwdHash against `PWD_HASH` environmental variable. If it valid it assumes `username` is the real user. You can easily override this endpoint extending the class:
```js
    class MyWebserver extends Webserver {
        protected setupLoginEndpoint() {
            this.app.post('/login', (req, res) => {
                // ... any login
                if ( booleanLoginResult )
                    res.send( jwt.sign({ userInfo: userInfo }, this.jwtSecret ) )
                    else res.status(403).send('wrong password')
            })
        }
    }
```

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