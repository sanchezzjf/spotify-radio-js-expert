import config from "./config.js"
import { Controller } from "./controller.js"
import { logger } from "./util/logger.js"

const controller = new Controller()

async function routes(req, res) {
    const { method, url } = req

    if(method === 'GET' && url === '/'){
        res.writeHead(302, {
            'Location': config.location.home
        })
        return res.end()
    }

    if(method === 'GET' && url === '/home'){
        const {
            stream
        } = await controller.getFileStream(config.pages.homeHTML)

        //padrao do response é text/html
        /*
        res.writeHead(200, {
            'Content-Type': 'text/html'
        })
        */

        return stream.pipe(res)
    }
    if(method === 'GET' && url === '/controller'){
        const {
            stream
        } = await controller.getFileStream(config.pages.controllerHTML)

        return stream.pipe(res)
    }

    if(method === 'GET'){
        const {
            stream,
            type
        } = await controller.getFileStream(url)

        const contentType = config.constants.CONTENT_TYPE[type]
        if(contentType){
            res.writeHead(200, {
                'Content-Type': contentType
            })
        }

        return stream.pipe(res)
    }

    res.writeHead(404)
    return res.end()
}

function handleError(err, res) {
    if(err.message.includes('ENOENT')){
        logger.warn(`asset not found ${err.stack}`)
        res.writeHead(404)
        return res.end()
    }
    logger.error(`Caught error on API ${err.stack}`)
    res.writeHead(500)
    return res.end()
}

export function handler(req, res){

    return routes(req, res)
    .catch(err => handleError(err, res))
}