const Sequelize = require('sequelize')

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database/development.sqlite'
})

class User extends Sequelize.Model {

}

User.init({
    id: { type: Sequelize.STRING, autoIncrement: false, primaryKey: true },
    woke: Sequelize.BOOLEAN,
    coupon_code: { type: Sequelize.INTEGER, allowNull: true }
}, { sequelize })

module.exports = User
