const functions = require('firebase-functions');
const menuProvider = require("./lib/menuProvider");
const fetch = require("node-fetch");

exports.tresorMenu = functions.https.onRequest(async (request, response) => {

    try {
        const todaysMeals = await menuProvider.getTodaysMeals(fetch);

        //Slack formatting
        let message = "Heute beim Tresori: \n\n";
        todaysMeals.map(x => x.meals.map(m => message += m + '\n'))
        
        //Microsoft Teams formatting
        //TODO: find out how Cards have to be formatted and how the response needs to look like 
        //in order for teams to properly show the menu

        response.send({
            type: "message",
            text: message
        });

    } catch (e) {
        console.log("Error fetching Tresor's weekly menu: " + e.message)
        response.send({
            type: "message",
            text: "Uups - da ging wat schief! Hier geht's zur Online Karte: http://www.restaurant-tresor.de/ "
        });
    }

});
