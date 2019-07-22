const Coupon = require('../models/coupon')
const Shop = require('../models/shop')

const subcommand = process.argv[2]

if (subcommand == 'new') {
    
    const shop_id = process.argv[3]
    const content = process.argv[4]

    Shop.findOne({
        where: {
            id: shop_id
        }
    }).then(r => {
        
        Coupon.sync().then(() => {
            Coupon.create({
                shop_id: shop_id,
                content: content
            })
        })
    })

    return
}

if (subcommand == 'list') {

    const shop_id = process.argv[3]

    if (shop_id) {

        Coupon.sync().then(() => {
            Coupon.findAll({ where: { id: shop_id } }).then((r) => {
                r.forEach(({ dataValues }) => { console.log(dataValues) })
            })
        })

        return
    }

    Coupon.sync().then(() => {
        Coupon.findAll().then((r) => {
            r.forEach(({ dataValues }) => { console.log(dataValues) })
        })
    })

    return
}
