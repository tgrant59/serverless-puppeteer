import puppeteer from 'puppeteer'
import ChromeInstaller from './chromeInstaller'

const chrome = new ChromeInstaller({
    executePath: 'headless_shell',
    s3Bucket: 'cdn.sunburst.io',
    s3Key: 'chrome/HeadlessChrome-66.0.3343.0.tar.gz',
})

let browser

const setupBrowser = async () => {
    await chrome.setupChrome()
    const config = process.env.IS_LOCAL
        ? {
              args: ['--disable-setuid-sandbox', '--no-sandbox'],
          }
        : {
              args: [
                  '--disable-gpu',
                  '--disable-setuid-sandbox',
                  '--no-sandbox',
                  '--single-process',
              ],
              executablePath: chrome.executablePath,
          }
    return puppeteer.launch(config)
}

export const getBrowser = async () => {
    if (!browser) {
        browser = await setupBrowser()
    }
    return browser
}

export default getBrowser
