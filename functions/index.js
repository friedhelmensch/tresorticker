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

        const test = {
            contentType: "application/vnd.microsoft.teams.card.o365connector",
            content: {
                "@type": "MessageCard",
                "@context": "http://schema.org/extensions",
                summary: "Summary",
                title: "Connector Card Markdown formatting",
                sections: [
                    {
                        text: "This is some **bold** text"
                    },
                    {
                        text: "This is some _italic_ text"
                    },
                    {
                        text: "# Header 1\r## Header 2\r### Header 3"
                    },
                    {
                        text: "- Bullet \r- List \r"
                    },
                    {
                        text: "1. Numbered\r1. List \r"
                    },
                    {
                        text: "Link: [Bing](https://www.bing.com)"
                    },
                    {
                        text:
                            "embedded image link: ![Duck on a rock](http://aka.ms/Fo983c)"
                    },
                    {
                        text: "`preformatted text`"
                    },
                    {
                        text:
                            "Newlines (backslash n, backslash n):\n\nline a\n\nline b\n\nline c"
                    },
                    {
                        text: ">This is a blockquote"
                    }
                ]
            }
        };

        response.send({
            type: "message",
            text: test
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
