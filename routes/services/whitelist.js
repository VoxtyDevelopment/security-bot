module.exports = function(app) {
    app.get('/services/whitelist', async (req, res) => {
        const providedKey = req.query.APIKey;
        const { con, config } = require('../../index');

        
        if(!providedKey) {
            return res.json({
                status: "NO_KEY",
                code: 304,
                message: "You did not provide an API Key"
            })
        }
        
        if(providedKey != config.MLPAPIKey) {
            return res.json({
                status: "INCORECT_KEY",
                code: 304,
                message: "The API key you have provided is incorrect"
            })
        }

        con.query("SELECT * FROM users WHERE isMuted = 0", async (err, rows) => {
            const hexes = [];

            if(err) {
                console.log(err)
                return res.json({
                    status: "ERROR",
                    code: 500,
                    message: "There was an error while requesting this data",
                })
            }

            i = 0;
            while (i < rows.length) {
                let hex = rows[i].steamHex;

                if(hex === null || hex === "") return;

                hexes.push(hex);
                i++
            }

            res.json({
                status: "GOOD_REQUEST",
                code: 200,
                message: "Good request, here are all the whitelisted hex's",
                data: hexes
            })
            console.log("FiveM server whitelist has been refreshed");
        })
    })
}