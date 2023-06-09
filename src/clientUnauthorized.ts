import axios from 'axios';
import https from 'https';

const agent = new https.Agent({
    rejectUnauthorized: false,
});

axios.defaults.httpsAgent = agent;
