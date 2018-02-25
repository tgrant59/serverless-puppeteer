import getBrowser from './getBrowser'

const isObject = value => {
    return value && typeof value === 'object' && value.constructor === Object
}

const formatResponse = responseData => {
    let response
    if (typeof responseData === 'string') {
        response = { body: responseData }
    } else if (!isObject(responseData)) {
        throw new Error(
            'Lambda function must return either a string or an object',
        )
    } else {
        response = responseData
    }
    return {
        isBase64Encoded: false,
        statusCode: 200,
        headers: {},
        body: '',
        ...response,
    }
}

export const createHandler = func => async (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false // eslint-disable-line no-param-reassign
    const browser = await getBrowser()

    try {
        const responseData = await func(browser)
        callback(null, formatResponse(responseData))
    } catch (e) {
        callback(e)
    }
    if (process.env.IS_LOCAL) process.exit(0)
}

export default createHandler
