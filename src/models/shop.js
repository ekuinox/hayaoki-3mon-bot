const Sequelize = require('sequelize')

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database/development.sqlite'
})

class Shop extends Sequelize.Model {

}

Shop.init({
    name: Sequelize.STRING
}, { sequelize })

module.exports = Shop
