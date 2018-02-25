import { createHandler } from 'utils'

const test = async browser => {
    const page = await browser.newPage()
    await page.goto('https://www.google.co.jp')
    const title = await page.title()
    await page.close()
    return { title }
}

export const handler = createHandler(test)
