import express from 'express';
import _ from 'lodash';

export function prepareApp(app: express.Express, name?: string) {
    app.use(function (req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header(
            'Access-Control-Allow-Headers',
            'Version, Access-Control-Allow-Origin, Authorization, Origin, X-Requested-With, Content-Type, Accept, ETag, Cache-Control, If-None-Match'
        );
        res.header(
            'Access-Control-Expose-Headers',
            'Etag, Authorization, Origin, X-Requested-With, Content-Type, Accept, If-None-Match, Access-Control-Allow-Origin'
        );
        res.header(
            'Access-Control-Allow-Methods',
            'POST, GET, PUT, DELETE, OPTIONS, PATCH'
        );
        next();
    });

    app.get('/server', (req, res) => {
        res.send(`${name ? name + ' ' : ''}server up and running!`);
    });
}
