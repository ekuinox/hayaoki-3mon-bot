const Sequelize = require('sequelize')

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database/development.sqlite'
})

// ユーザに発行されたクーポンを扱う

class UsersCoupon extends Sequelize.Model {

}

UsersCoupon.init({
    code: Sequelize.INTEGER,
    coupon_id: Sequelize.INTEGER, // Coupon.id => Shopに紐付いたクーポン
    woke: Sequelize.BOOLEAN, // ユーザが起きているか
    valid_day: Sequelize.DATE // そのクーポンが有効な日
}, { sequelize })

module.exports = UsersCoupon
