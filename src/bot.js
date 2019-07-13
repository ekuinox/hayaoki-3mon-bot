const EventEmitter = require('events')
const express = require('express')
const LineSdk = require('@line/bot-sdk')

/*
 * LINEのメッセージをイベントとして扱うクラス
 */
module.exports = class LineBot extends EventEmitter {

    constructor(accessToken, channelSecret) {
        super()
        this.config = {
            channelAccessToken: accessToken,
            channelSecret: channelSecret
        }
        this.server = express()
    }

    run(port = 3000) {
        this.server.post('/webhook', LineSdk.middleware(this.config), (req, res, next) => {
            res.sendStatus(200)
            req.body.events.forEach((event) => {
                if (event.type == 'message') {
                    if (event.message.type == 'text') {
                        this.emit('textMessage', event)
                        return
                    }
                    if (event.message.type == 'image') {
                        this.emit('imageMessage', event)
                        return
                    }
                    if (event.message.type == 'sticker') {
                        this.emit('stickerMessage', event)
                        return
                    }
                }
            })
        })
        this.server.listen(port)
    }
}
