const HTTPS = require('https')
const URL = require('url')

class InstapagoRestClient {
    constructor (apiKey, publicKey) {
        this._apiKey = apiKey
        this._publicKey = publicKey
    }

    get apiKey () {
        return this._apiKey
    }

    get publicKey () {
        return this._publicKey
    }

    set apiKey (apiKey) {
        this._apiKey = apiKey
    }

    set publicKey (publicKey) {
        this._publicKey = publicKey
    }

    _prepareRequest (method, endpoint, options, responseHandler) {
       
        // Prepare options of the request
        let requestOptions = new URL("https://api.instapago.com")
        requestOptions.pathname += `/${endpoint}`

        let headers = {
            'Content-Type': 'application/x-www-form-urlencoded'
        }

        let bodyString = ''

        if (method !== "GET") {
            options = {
                ...options,
                KeyId: this._apiKey,
                PublicKeyId: this._publicKey
            }
            
            bodyString = JSON.stringify(options)
            headers = {...headers, 'Content-Length': bodyString.length}
        } else {
            for (let obj in options) {
                if (options[obj]) {
                    requestOptions.searchParams.append(obj, options[obj])
                }
            }
        }

        const requestData = {
            'hostname': requestOptions.hostname,
            'port': 443,
            'path': requestOptions.pathname,
            'method': method,
            'headers': headers
        }

        const req = HTTPS.request(requestData, (resp) => {
            let data = ''

            // A chunk of data has been recieved.
            resp.on('data', (chunk) => {
                data += chunk
            })

            // The whole response has been received. Print out the result.
            resp.on('end', () => {
                responseHandler(resp, data)
            })
        })

        req.on('error', () => {})
        req.write(bodyString)

        return req
    }

    createPayment (options) {
        return new Promise((resolve, reject) => {
            try {
                this._prepareRequest('POST', 'payment', options, (response, data) => {
                    if (response.statusCode >= 400 && status < 600) {
                        reject(JSON.parse(data))
                    } else {
                        resolve(JSON.parse(data))
                    }
                }).end()
            } catch (err) {
                reject(err)
            }
        })
    }

    completePayment (options) {
        return new Promise((resolve, reject) => {
            try {
                this._prepareRequest('POST', 'complete', options, (response, data) => {
                    if (response.statusCode >= 400 && status < 600) {
                        reject(JSON.parse(data))
                    } else {
                        resolve(JSON.parse(data))
                    }
                }).end()
            } catch (err) {
                reject(err)
            }
        })
    }

    cancelPayment (options) {
        return new Promise((resolve, reject) => {
            try {
                this._prepareRequest('DELETE', 'payment', options, (response, data) => {
                    if (response.statusCode >= 400 && status < 600) {
                        reject(JSON.parse(data))
                    } else {
                        resolve(JSON.parse(data))
                    }
                }).end()
            } catch (err) {
                reject(err)
            }
        })
    }

    paymentInquiry (options) {
        return new Promise((resolve, reject) => {
            try {
                this._prepareRequest('GET', 'payment', options, (response, data) => {
                    if (response.statusCode >= 400 && status < 600) {
                        reject(JSON.parse(data))
                    } else {
                        resolve(JSON.parse(data))
                    }
                }).end()
            } catch (err) {
                reject(err)
            }
        })
    } 
}
