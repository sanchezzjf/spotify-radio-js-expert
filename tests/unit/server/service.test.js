import { jest, expect, describe, test, beforeEach } from '@jest/globals'
import { Service } from '../../../server/service.js'
import TestUtil from '../_util/testUtil.js'
import fs from 'fs'
import config from '../../../server/config.js'
import fsPromises from 'fs/promises'
import path from 'path'

const {
    dir: {
        publicDir
    }
} = config

describe('#Service - test suite for the API logic', () => {
    beforeEach(() => {
        jest.restoreAllMocks()
        jest.clearAllMocks()
    })
    test('createFileStream - should create a file stream to the requested file', () => {
        const mockFileStream = TestUtil.generateReadableStream(['data'])
        const file = '/index.html'
        jest.spyOn(fs, fs.createReadStream.name).mockResolvedValue(mockFileStream)

        const service = new Service()
        const serviceReturnedValue = service.createFileStream(file)

        expect(fs.createReadStream).toHaveBeenCalledWith(file)
        expect(serviceReturnedValue).resolves.toStrictEqual(mockFileStream)
    })
    test('getFileInfo - should return the full file path and the extension of the file', async () => {
        const file = '/index.html'
        const expectedType = '.html'
        const expectedFullPath = `${publicDir}${file}`
        jest.spyOn(fsPromises, fsPromises.access.name).mockResolvedValue(null)

        jest.spyOn(path, path.join.name).mockResolvedValue(expectedFullPath)

        jest.spyOn(path, path.extname.name).mockResolvedValue('.html')

        const service = new Service()   
        const serviceReturnedValue = await service.getFileInfo(file)

        expect(serviceReturnedValue).toStrictEqual({
            type: expectedType,
            name: expectedFullPath
        })


    })
    test('getFileStream - should return the file stream and the type of the file', async () => {
        const mockFileStream = TestUtil.generateReadableStream(['data'])
        const file = '/index.html'
        const expectedType = '.html'
        const expectedFullPath = `${publicDir}${file}`

        jest.spyOn(fs, fs.createReadStream.name).mockResolvedValue(mockFileStream)
        
        jest.spyOn(fsPromises, fsPromises.access.name).mockResolvedValue(null)

        jest.spyOn(path, path.join.name).mockResolvedValue(expectedFullPath)

        jest.spyOn(path, path.extname.name).mockResolvedValue('.html')


        const service = new Service()
        const serviceReturnedValue = await service.getFileStream(file)

        expect(serviceReturnedValue.stream).resolves.toStrictEqual(mockFileStream)
        expect(serviceReturnedValue.type).toStrictEqual(expectedType)
         
    })
})