const Bot = require('./line')

require('dotenv').config()

const LINE_CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN
const LINE_CHANNEL_SECRET = process.env.LINE_CHANNEL_SECRET

const bot = new Bot(LINE_CHANNEL_ACCESS_TOKEN, LINE_CHANNEL_SECRET)

bot.on('textMessage', (message, reply) => {
    reply({ type: 'text', text: message.text })
})

bot.run('/webhook')
