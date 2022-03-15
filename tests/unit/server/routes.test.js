import { jest, expect, describe, test, beforeEach } from '@jest/globals'
import config from '../../../server/config.js'
import { Controller } from '../../../server/controller.js'
import { handler } from '../../../server/routes.js'
import TestUtil from '../_util/testUtil.js'
const {
    pages: {
        homeHTML,
        controllerHTML
    },
    location,
    constants: {
        CONTENT_TYPE
    }
} = config

describe('#Routes - test suite for API response', () => {
    beforeEach(() => {
        jest.restoreAllMocks()
        jest.clearAllMocks()
    })
    test('GET / - should redirect to home page', async () => {
        const params = TestUtil.defaultHandleParams()
        params.req.method = 'GET'
        params.req.url = '/' 

        await handler(...params.values())

        expect(params.res.writeHead).toBeCalledWith(302, {
            'Location': location.home
        })
        expect(params.res.end).toHaveBeenCalled()

    })

    test(`GET /home - should respond with ${homeHTML} file stream`, async () => {
        const params = TestUtil.defaultHandleParams()
        params.req.method = 'GET'
        params.req.url = '/home' 

        const mockFileStream = TestUtil.generateReadableStream(['data'])
        jest.spyOn(
            Controller.prototype,
            Controller.prototype.getFileStream.name,
        ).mockResolvedValue({
            stream: mockFileStream,
        }) 

        jest.spyOn(
            mockFileStream,
            'pipe'
        ).mockReturnValue()


        await handler(...params.values())

        expect(Controller.prototype.getFileStream).toBeCalledWith(homeHTML)
        expect(mockFileStream.pipe).toHaveBeenCalledWith(params.res)
    })

    test(`GET /controller - should respond with ${controllerHTML} file stream`, async () => {
        const params = TestUtil.defaultHandleParams()
        params.req.method = 'GET'
        params.req.url = '/controller' 

        const mockFileStream = TestUtil.generateReadableStream(['data'])
        jest.spyOn(
            Controller.prototype,
            Controller.prototype.getFileStream.name,
        ).mockResolvedValue({
            stream: mockFileStream,
        }) 

        jest.spyOn(
            mockFileStream,
            'pipe'
        ).mockReturnValue()


        await handler(...params.values())

        expect(Controller.prototype.getFileStream).toBeCalledWith(controllerHTML)
        expect(mockFileStream.pipe).toHaveBeenCalledWith(params.res)
    })

    test(`GET /index.html - should respond with file stream`, async () => {
        const params = TestUtil.defaultHandleParams()
        const filename = '/index.html'
        params.req.method = 'GET'
        params.req.url = filename
        const expectedType = '.html'


        const mockFileStream = TestUtil.generateReadableStream(['data'])
        jest.spyOn(
            Controller.prototype,
            Controller.prototype.getFileStream.name,
        ).mockResolvedValue({
            stream: mockFileStream,
            type: expectedType
        }) 

        jest.spyOn(
            mockFileStream,
            'pipe'
        ).mockReturnValue()


        await handler(...params.values())

        expect(Controller.prototype.getFileStream).toBeCalledWith(filename)
        expect(mockFileStream.pipe).toHaveBeenCalledWith(params.res)
        expect(params.res.writeHead).toHaveBeenCalledWith(200, {
            'Content-Type': CONTENT_TYPE[expectedType]
        })
    })

    test(`GET /file.ext - should respond with file stream but with no content-type`, async () => {
        const params = TestUtil.defaultHandleParams()
        const filename = '/file.ext'
        params.req.method = 'GET'
        params.req.url = filename
        const expectedType = '.ext'


        const mockFileStream = TestUtil.generateReadableStream(['data'])
        jest.spyOn(
            Controller.prototype,
            Controller.prototype.getFileStream.name,
        ).mockResolvedValue({
            stream: mockFileStream,
            type: expectedType
        }) 

        jest.spyOn(
            mockFileStream,
            'pipe'
        ).mockReturnValue()


        await handler(...params.values())

        expect(Controller.prototype.getFileStream).toBeCalledWith(filename)
        expect(mockFileStream.pipe).toHaveBeenCalledWith(params.res)
        expect(params.res.writeHead).not.toHaveBeenCalledWith(200, {
            'Content-Type': CONTENT_TYPE[expectedType]
        })
    })

    test(`GET /unknown - given an inexistent route it should respond with 404`, async () => {
        const params = TestUtil.defaultHandleParams()
        params.req.method = 'POST'
        params.req.url = '/unknown' 

        await handler(...params.values())

        expect(params.res.writeHead).toHaveBeenCalledWith(404)
        expect(params.res.end).toHaveBeenCalled()
    })

    describe('exceptions', () => {
        test('given inexistent file it should respond with 404', async () => {
            const params = TestUtil.defaultHandleParams()
            params.req.method = 'GET'
            params.req.url = '/index.png'
            
            jest.spyOn(
                Controller.prototype,
                Controller.prototype.getFileStream.name
            ).mockRejectedValue(new Error('Error: ENOENT no such file or directory'))
    
            await handler(...params.values())
    
            expect(params.res.writeHead).toHaveBeenCalledWith(404)
            expect(params.res.end).toHaveBeenCalled()
        })
        test('given an error it should respond with 500', async () => {
            const params = TestUtil.defaultHandleParams()
            params.req.method = 'GET'
            params.req.url = '/index.png'
            
            jest.spyOn(
                Controller.prototype,
                Controller.prototype.getFileStream.name
            ).mockRejectedValue(new Error('Error: '))
    
            await handler(...params.values())
    
            expect(params.res.writeHead).toHaveBeenCalledWith(500)
            expect(params.res.end).toHaveBeenCalled()
        })
    })
})