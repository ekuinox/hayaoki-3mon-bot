const User = require('../models/user')

const subcommand = process.argv[2]

if (subcommand == 'show') {

    const user_id = process.argv[3]

    if (!user_id) return

    User.sync().then(() => {
        User.findAll({ where: { id: user_id } }).then((r) => {
            r.forEach(({ dataValues }) => { console.log(dataValues) })
        })
    })

    return
}
