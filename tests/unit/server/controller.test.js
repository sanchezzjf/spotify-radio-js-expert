import { jest, expect, describe, test, beforeEach } from '@jest/globals'
import { Controller } from '../../../server/controller.js'
import { Service } from '../../../server/service.js'
import TestUtil from '../_util/testUtil.js'

describe('#Controller - test suite for the controller operations', () => {
    beforeEach(() => {
        jest.restoreAllMocks()
        jest.clearAllMocks()
    })
    test('getFileStream - should instanciate the Service class and return a file stream', async () => {
        const mockFileStream = TestUtil.generateReadableStream(['data'])
        const expectedType = '.html'

        jest.spyOn(
            Service.prototype,
            Service.prototype.getFileStream.name
        ).mockResolvedValue({
            stream: mockFileStream,
            type: expectedType
        })

        const controller = new Controller()
        const controllerReturnedValue = await controller.getFileStream('/index.html')
        
        expect(Service.prototype.getFileStream).toBeCalledWith('/index.html')
        expect(controllerReturnedValue).toStrictEqual({
            stream: mockFileStream,
            type: expectedType
        })
    })
})