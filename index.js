const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");

const app = express();
app.use(bodyParser.json());

const PLAYFAB_CLOUDSCRIPT_URL = "https://5A57F.playfabapi.com/CloudScript/ExecuteFunction";

app.post("/discord-interactions", async (req, res) => {
    const interaction = req.body;
    if (!interaction || !interaction.data || !interaction.data.custom_id.startsWith("ban_player_")) {
        return res.status(400).send("Invalid request");
    }

    // Call PlayFab CloudScript to process the ban
    const playfabResponse = await fetch(PLAYFAB_CLOUDSCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            FunctionName: "HandleBanButton",
            FunctionParameter: { interaction }
        })
    });

    const playfabData = await playfabResponse.json();

    // Respond to Discord
    res.json({
        type: 4,
        data: { content: playfabData.message }
    });
});

app.listen(3000, () => console.log("Listening for Discord interactions on port 3000"));
