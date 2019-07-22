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
        this.client = new LineSdk.Client(this.config)
        this.server = express()
    }

    run(path = '/', port = 3000) {
        this.server.post(path, LineSdk.middleware(this.config), (req, res, next) => {
            res.sendStatus(200)

            req.body.events.forEach(event => {
                
                if (event.type == 'message') {
                    const emit = (type, event) => {
                        this.emit(type, event.message, message => { this.client.replyMessage(event.replyToken, message) }, event.source, event)
                    }

                    emit((type => {
                        if (type == 'text') return 'textMessage'
                        if (type == 'image') return 'imageMessage'
                        return 'stickerMessage'
                    })(event.message.type), event)
                    
                    return
                }

            })
        })

        this.server.listen(port)
    }
}
