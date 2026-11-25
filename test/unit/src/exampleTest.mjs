import {describe, expect, it} from '@jest/globals'

describe('The system under test', () => {
    it('Should do something When something else', () => expect(true).toBe(true))

    describe('a specific unit', () => {
        it('Should pass When called successfully', () => expect(true).toBe(true))
        it.failing('Should also pass When called', () => {throw new Error('foo')})
        it.todo('Should be marked as "todo" When called')
        it.skip('Should be marked as skipped When called', () => {})
    })
})
