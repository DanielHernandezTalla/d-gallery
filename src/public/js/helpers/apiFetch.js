'use strict'

export class ApiFetch{
    async execute(options){
        let {
            url,
            method,
            success,
            error,
            data,
        } = options

        let init

        if(method === 'GET' || method === 'DELETE' || method === null)
            init = {
                method: method || 'GET',
                headers:{
                    'Content-Type': 'application/json; charset=utf-8'
                }
            }
        else
            init = {
                method: method || 'GET',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                }
            }

        try{
            let res = await fetch(url, init)

            if(!res.ok) throw {
                status: res.status,
                statusText: res.statusText
            }

            let json = await res.json()

            success(json)
        }catch(err){
            let message = err.statusText || 'Error in the request'
            error(message)
        }
    }
}