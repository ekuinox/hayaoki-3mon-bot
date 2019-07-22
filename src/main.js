const Bot = require('./line')
const Coupon = require('./models/coupon')
const Shop = require('./models/shop')
const User = require('./models/user')

require('dotenv').config()

const LINE_CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN
const LINE_CHANNEL_SECRET = process.env.LINE_CHANNEL_SECRET

const bot = new Bot(LINE_CHANNEL_ACCESS_TOKEN, LINE_CHANNEL_SECRET)

bot.on('textMessage', async (message, reply, source) => {

    // おやすみコマンド
    if (message.text.match(/((寝|ね)(る|ます)|おやすみ)/)) {

        try {
            const { dataValues } = await User.findOne({where: { id: source.userId }})
            if (dataValues.coupon_code) return
        } catch (err) {
            console.log(err)
        }

        Coupon.sync().then(async () => {

            const result = await Coupon.findAll()
            let replyText = 'いまあるクーポンはこちら'
            
            Promise.all(result.map(({ dataValues }) => {
                const shop_id = dataValues.shop_id
                const content = dataValues.content
                
                return Shop.findOne({
                    where: {
                        id: shop_id
                    }
                }).then(({ dataValues }) => {
                    replyText += `\n${dataValues.name}の${content}`
                })
            })).then(() => {
                reply({ type: 'text', text: replyText})
            })
        })

        return
    }

    reply({ type: 'text', text: message.text })
})

bot.run('/webhook')
