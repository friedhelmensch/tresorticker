const functions = require("firebase-functions");
const menuProvider = require("./lib/menuProvider");
const fetch = require("node-fetch");

exports.tresorMenu = functions.https.onRequest(async (request, response) => {
    try {
        const todaysMeals = await menuProvider.getTodaysMeals(fetch);

        const openingListTag = "<ul>";

        const allMeals = todaysMeals.map(x => x.meals.map(meal => meal));
        const flatMeals = allMeals.reduce(
            (prev, curr) => prev.concat(curr),
            []
        );
        const mealsAsListEntries = flatMeals.reduce(
            (prev, curr) => (prev += "<li>" + curr + "</li>"),
            ""
        );

        const closingListTag = "</ul>";
        const message = openingListTag + mealsAsListEntries + closingListTag;

        response.send({
            type: "message",
            text: message
        });
    } catch (e) {
        console.log("Error fetching Tresor's weekly menu: " + e.message);
        response.send({
            type: "message",
            text:
                "Uups - da ging wat schief! Hier geht's zur Online Karte: http://www.restaurant-tresor.de/ "
        });
    }
});
