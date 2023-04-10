import axios from 'axios';
import https from 'https';
import Backend from './clientBackend';

const agent = new https.Agent({
    rejectUnauthorized: false,
});

axios.defaults.httpsAgent = agent;
