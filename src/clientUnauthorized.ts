import axios from 'axios'
import https from 'https'
import { Backend, Entity, EntitySaveOptions, EntityRequestResult } from './client'

const agent = new https.Agent({  
    rejectUnauthorized: false
})

axios.defaults.httpsAgent = agent

export { Backend, EntityRequestResult, Entity, EntitySaveOptions }