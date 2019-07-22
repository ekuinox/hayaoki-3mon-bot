const UsersCoupon = require('../models/users_coupon')

const subcommand = process.argv[2]

if (subcommand == 'list') {

    const coupon_id = process.argv[3]

    if (!coupon_id) return

    UsersCoupon.sync().then(() => {
        UsersCoupon.findAll({ where: { coupon_id: coupon_id } }).then((r) => {
            r.forEach(({ dataValues }) => { console.log(dataValues) })
        })
    })

    return
}
