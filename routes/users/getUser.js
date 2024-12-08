//
module.exports = function(app) {
    app.get('/users/getUser/:uId', async (req, res) => {
        const uid = req.params.uId
        const { userInfo } = require('../../utilities/discord/userInfo')


        if(!uid) {
            return res.json({
                status: "NO_UID_PROVIDED",
                code: 300,
                message: "Bad request"
            })
        }

        const userI = await userInfo(uid)

        return res.json({
            status: "REQUEST_COMPLETE",
            code: 200,
            message: "Good request, here is the information",
            data: userI
        })
    })
}