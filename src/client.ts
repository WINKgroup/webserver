import axios from 'axios'

export default class Backend {
    rejectUnauthorized = true

    constructor(rejectUnauthorized:boolean) {
        this.rejectUnauthorized = rejectUnauthorized
    }

    async get() {
        if (this.rejectUnauthorized) {
            const https = require('https')
            const agent = new https.Agent({  
                rejectUnauthorized: false
            })
            const response = await axios.get('https://google.com', {
                httpsAgent: agent
            })
            return response
        } else axios.get('https://google.com')
    }
}