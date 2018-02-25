import { createHandler } from 'utils'

const test = async browser => {
    const page = await browser.newPage()
    await page.goto('https://www.google.co.jp')
    const content = await page.content()
    await page.close()
    return content
}

export const handler = createHandler(test)
