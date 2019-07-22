const Shop = require('../models/shop')

const subcommand = process.argv[2]

if (subcommand == 'new') {

    // ショップを作るためのスクリプト

    const shop_name = process.argv[3]

    Shop.sync().then(() => {
        Shop.create({
            name: shop_name
        }).then(({ dataValues }) => { console.log(dataValues) })
    })

    return
}

if (subcommand == 'list') {
    Shop.sync().then(() => {
        Shop.findAll().then((r) => {
            r.forEach(({ dataValues }) => { console.log(dataValues) })
        })
    })

    return
}
