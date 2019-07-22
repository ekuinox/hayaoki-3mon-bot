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
            
            Promise.all(result.map(({ dataValues }) => {
                const shop_id = dataValues.shop_id
                const content = dataValues.content
                const coupon_id = dataValues.id
                
                return new Promise((resolve, reject) => {
                    Shop.findOne({
                        where: {
                            id: shop_id
                        }
                    }).then(({ dataValues }) => {
                        resolve({label: `${dataValues.name}の${content}`, text: `select_coupon ${coupon_id}`})
                    })
                })
            })).then((result) => {
                const message = {
                    type: 'template',
                    altText: 'this is a buttons template',
                    template: {
                        type: 'buttons',
                        actions: result.map(v => {
                            return {
                                type: 'message',
                                label: v.label,
                                text: v.text
                            }
                        }),
                    title: 'タイトルです',
                    text: 'テキストです'
                  }
                }

                reply(message)
            })
        })

        return
    }

    // クーポンを選択して返す
    const m = message.text.match(/select_coupon ([0-9]+)/)
    if (m) {
        const coupon_id = m[1]

        try {
            const { dataValues: coupon } = await Coupon.findOne({
                where: {
                    id: coupon_id
                }
            })

            try {
                const { dataValues } = await User.findOne({where: { id: source.userId }})
                if (dataValues.coupon_code) return
            } catch (err) {
                User.create({
                    id: source.userId,
                    woke: false,
                    coupon_code: Math.floor(Math.random() * 1000)
                }).then(({ dataValues: user }) => {
                    reply({ type: 'text', text: 'おっけーおやすみ！！'})
                    console.log(`${user.id} coupon_code -> ${user.coupon_code}`)
                })
                
                return
            }

            User.update({
                id: source.userId,
                woke: false,
                coupon_code: Math.floor(Math.random() * 1000)
            }).then(({ dataValues: user }) => {
                reply({ type: 'text', text: 'おっけーおやすみ！！'})
                console.log(`${user.id} coupon_code -> ${user.coupon_code}`)
            })
            
        } catch (err) {
            return
        }

        
        reply({ type: 'text', text: `coupon_id => ${coupon_id}`})

        return
    }

    reply({ type: 'text', text: 'おい！何にもマッチしないぞ！寝ぼけてんのか！' })
})

bot.run('/webhook')
