/* istanbul ignore file */
import { jest } from '@jest/globals'
import { Readable, Writable } from 'stream'

export default class TestUtil {

    static generateReadableStream(data){
        return new Readable({
            read() {
                for(const item of data){
                    this.push(item)
                }
                this.push(null)
            }
        })
    }
    static generateWritableStream(onData){
        return new Writable({
            write(chunk, enc, cb) {
                onData(chunk)
                cb(null, chunk)
            }
        })
    }

    static defaultHandleParams(){
        const reqStream = TestUtil.generateReadableStream(['req body'])
        const res = TestUtil.generateWritableStream()
        const data = {
            req: Object.assign(reqStream, {
                headers: {},
                method: '',
                url: ''
            }),
            res: Object.assign(res, {
                writeHead: jest.fn(),
                end: jest.fn()
            })
        }
        
        return {
            values: () => Object.values(data),
            ...data
        }
    }
}