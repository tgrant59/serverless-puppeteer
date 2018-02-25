/* eslint-disable no-console */
import AWS from 'aws-sdk'
import fs from 'fs'
import path from 'path'
import tar from 'tar'
import os from 'os'

class ChromeInstaller {
    constructor({
        accessKeyId,
        secretAccessKey,
        s3Bucket,
        s3Key,
        executePath,
        debug,
    }) {
        // url to download chrome
        this.setupChromePath = os.tmpdir()
        this.executablePath = path.join(this.setupChromePath, executePath)
        AWS.config.update({
            accessKeyId: accessKeyId,
            secretAccessKey: secretAccessKey,
        })
        this.s3 = new AWS.S3({ apiVersion: '2006-03-01' })
        this.s3Bucket = s3Bucket
        this.s3Key = s3Key
        this.debug = debug
    }

    async setupChrome() {
        if (!await this.existsExecutableChrome()) {
            console.log('Chrome not yet installed')
            try {
                console.log('Downloading executable from s3')
                console.log('Download Status:', await this.setupFromS3())
                await this.existsExecutableChrome()
                if (this.debug) await this.listDirectory()
                return true
            } catch (e) {
                console.log('An error occurred when downloading Chrome from S3')
                console.log(e)
                return true
            }
        } else {
            console.log('Chrome already installed')
            return true
        }
    }

    async listDirectory() {
        return new Promise(resolve => {
            console.log(`Listing dir: ${this.setupChromePath}\n--------`)
            fs.readdir(this.setupChromePath, (err, items) => {
                items.forEach(item => {
                    console.log(item)
                })
                console.log('----------')
                resolve(true)
            })
        })
    }

    async existsExecutableChrome() {
        return new Promise(resolve => {
            fs.access(this.executablePath, fs.constants.F_OK, err => {
                if (!err) {
                    resolve(true)
                } else {
                    resolve(false)
                }
            })
        })
    }

    async setupFromS3() {
        return new Promise((resolve, reject) => {
            const params = {
                Bucket: this.s3Bucket,
                Key: this.s3Key,
            }
            console.log('Started download at', new Date().toString())
            this.s3
                .getObject(params)
                .createReadStream()
                .on('error', err => reject(err))
                .pipe(
                    tar.x({
                        C: this.setupChromePath,
                    }),
                )
                .on('error', err => reject(err))
                .on('finish', () => {
                    console.log('Finished at ', new Date().toString())
                })
                .on('end', () => {
                    console.log('Done at ', new Date().toString())
                    resolve('done')
                })
        })
    }
}

export default ChromeInstaller
