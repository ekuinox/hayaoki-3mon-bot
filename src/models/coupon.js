const Sequelize = require('sequelize')

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database/development.sqlite'
})

class Coupon extends Sequelize.Model {

}

Coupon.init({
    shop_id: Sequelize.INTEGER,
    content: Sequelize.STRING // クーポンの内容
}, { sequelize })

module.exports = Coupon
