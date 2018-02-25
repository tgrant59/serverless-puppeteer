import { formatResponse } from '../createHandler'

describe('formatResponse', () => {
    it('throws an error if response is not an object', () => {
        expect(() => formatResponse([])).toThrow()
        expect(() => formatResponse(false)).toThrow()
        expect(() => formatResponse('string')).toThrow()
        expect(() => formatResponse(42)).toThrow()
        expect(() => formatResponse({})).not.toThrow()
    })
})
