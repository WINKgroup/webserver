import axios from 'axios'
import sha256 from 'crypto-js/sha256'
import HexEncoder from 'crypto-js/enc-hex'
import _ from 'lodash'
import * as Yup from 'yup'
import ErrorManager, { ErrorManagerResult } from '@winkgroup/error-manager/build/client'

export class Backend {
    baseUrl:string
    protected token = ''
    protected isTokenLoaded = false

    constructor(baseUrl:string) {
        this.baseUrl = baseUrl
    }

    getToken() {
        if (!this.isTokenLoaded) this.token = window.localStorage.getItem("token") || ''
        this.isTokenLoaded = true
        return this.token
    }

    async loginHashedPassword(pwdHash:string, username = 'admin') {
        try {
            const response = await axios.post(`${ this.baseUrl }/login`, { pwdHash: pwdHash })
            this.token = response.data
            window.localStorage.setItem('token', this.token)
            return true
        } catch (e) {
            return false
        }
    }
    
    login(password:string, username = 'admin') {
        const pwdHash = sha256(password).toString(HexEncoder)
        return this.loginHashedPassword(pwdHash, username)
    }

    async logout() {
        this.token = ''
        window.localStorage.removeItem('token')
    }

    async get(path:string, addBaseUrl = true) {
        const url = addBaseUrl ? `${ this.baseUrl }${ path }` : path
        const response = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${this.getToken()}`
            }
        })
        return response
    }

    async post(path:string, data:any, addBaseUrl = true) {
        const url = addBaseUrl ? `${ this.baseUrl }${ path }` : path
        const response = await axios.post(url, data, {
            headers: {
                'Authorization': `Bearer ${this.getToken()}`
            }
        })
        return response
    }

    async put(path:string, data:any) {
        const response = await axios.put(`${ this.baseUrl }${ path }`, data, {
            headers: {
                'Authorization': `Bearer ${this.getToken()}`
            }
        })
        return response
    }

    async patch(path:string, data:any) {
        const response = await axios.patch(`${ this.baseUrl }${ path }`, data, {
            headers: {
                'Authorization': `Bearer ${this.getToken()}`
            }
        })
        return response
    }

    async delete(path:string) {
        await axios.delete(`${ this.baseUrl }${ path }`, {
            headers: {
                'Authorization': `Bearer ${this.getToken()}`
            }
        })
    }

    async materialTable<Model>(path:string, query:object) {
        const response = await axios.post(`${ this.baseUrl }${ path }`, query, {
            headers: {
                'Authorization': `Bearer ${this.getToken()}`
            }
        })

        return {
            data: response.data.data as Model[],
            page: response.data.page,
            totalCount: response.data.totalCount
        }
    }
}

export interface EntityOptions<IEntityUI extends {id: string}> {
    emptyEntity?: IEntityUI
    backend: Backend
    errorManager: ErrorManager
    isSaving?: (saving:boolean) => void
    sendFeeback?: (result:EntityRequestResult) => void
    sendFeedbackMessage?: (message:string) => void
}

interface EntityRequestSuccessResult {
    status: 'success'
    data: any
}

interface EntityRequestFailureResult extends ErrorManagerResult {
    error: unknown
}

export type EntityRequestResult = EntityRequestSuccessResult | EntityRequestFailureResult

export interface EntitySaveOptions<IEntityUI extends {id: string}> {
    previousEntity?: IEntityUI
    successMessage: string
}

export class Entity<IEntityUI extends {id: string}> {
    restEndpoint: string
    options: EntityOptions<IEntityUI>
    protected lastResult = null as EntityRequestResult | null

    constructor(restEndpoint:string, inputOptions?:Partial<EntityOptions<IEntityUI>>) {
        this.options = _.defaults(inputOptions, {
            backend: new Backend(restEndpoint),
            errorManager: new ErrorManager(),
            defaultSuccessFeedbackMessage: 'Saved'
        })
        this.restEndpoint = this.options.backend.baseUrl === restEndpoint ? '' : restEndpoint
    }

    getValidationSchema() {
        return Yup.object()
    }

    getResult() {
        return this.lastResult
    }

    protected sendFeedback(successMessage:string) {
        if (this.lastResult) {
            if (this.options.sendFeeback) this.options.sendFeeback(this.lastResult)
            if (this.options.sendFeedbackMessage) {
                const message = this.lastResult.status !== 'success' ? this.lastResult.message : successMessage
                this.options.sendFeedbackMessage(message)
            }
        }
    }

    async delete(id:string, successMessage?:string): Promise<EntityRequestResult> {
        if (!successMessage) successMessage = 'Deleted'

        try {
            if (this.options.isSaving) this.options.isSaving(true)
            await this.options.backend.delete(this.restEndpoint + '/' + id)
            this.lastResult = {
                status: 'success',
                data: {id: id}
            }
        } catch (e) {
            this.options.errorManager.e = e
            this.lastResult = {
                ...this.options.errorManager.get(),
                error: e
            }
        }

        if (this.options.isSaving) this.options.isSaving(false)
        this.sendFeedback(successMessage)
        return this.lastResult
    }

    async save(entity:IEntityUI, inputOptions?:Partial<EntitySaveOptions<IEntityUI>>): Promise<EntityRequestResult> {
        let id = entity['id']
        const options:EntitySaveOptions<IEntityUI> = _.defaults(inputOptions, { successMessage: 'Saved' })

        try {
            const validationSchema = this.getValidationSchema()
            await validationSchema.validate(entity)
            if (this.options.isSaving) this.options.isSaving(true)

            let data:any
            if (id) {
                const dataToSend = Entity.getDataToSend<IEntityUI>(entity, options.previousEntity, this.options.emptyEntity)
                const response = await this.options.backend.patch(this.restEndpoint + '/' + id, dataToSend)
                data = response.data
            } else {
                const dataToSend = Entity.getDataToSend<IEntityUI>(entity, undefined, this.options.emptyEntity)
                const response = await this.options.backend.post(this.restEndpoint, dataToSend)
                data = response.data
            }

            this.lastResult = {
                status: 'success',
                data: data
            }
        } catch (e) {
            this.options.errorManager.e = e
            this.lastResult = {
                ...this.options.errorManager.get(),
                error: e
            }
        }

        if (this.options.isSaving) this.options.isSaving(false)
        this.sendFeedback(options.successMessage)
        return this.lastResult
    }

    static getDataToSend<IEntityUI extends {id: string}>(entity:IEntityUI, previous?:IEntityUI, base?:IEntityUI) {
        const dataToSend:Partial<IEntityUI> = {}
        const cycler = base ? base : entity

        for( const key in cycler ) {
            if (key === 'id') continue
            if(previous && _.isEqual(entity[key], previous[key])) continue
            dataToSend[key] = entity[key]
        }

        return dataToSend
    }
}