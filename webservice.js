// express API?!?!?
const express = require('express')
const app = express()
const PORT = 5623

// routes
require('./routes/users/getUser')(app);
require('./routes/services/whitelist')(app);
require('./routes/services/whitelistdev')(app);




app.get("/", (req, res) => {
    res.json({
        status: "SERVICES_OPERATIONAL",
        code: "200",
        message: "API Services are operational"
    })
})

const startAPI = async() => {
    app.listen(PORT)
    console.log("API Services Started")
}

module.exports = { startAPI }
