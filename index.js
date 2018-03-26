const fetch = require("node-fetch");
var express = require('express');
var app = express();
const menuProvider = require('./menuProvider');

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))

app.post('/', async function (request, response) {

  response.setHeader('Content-Type', 'application/json');

  try {
    const todaysMeals = await menuProvider.getTodaysMeals(fetch);
    
    let message = "Heute beim Tresor: \n\n";
    todaysMeals.map(x => x.meals.map(m => message+=m + '\n'))

    response.send({
      response_type: "in_channel",
      text: message
    });

  } catch (e) {
    console.log("Error fetching Tresor's weekly menu: " + e.message)
    response.send({
      response_type: "ephemeral",
      text: "Uups - da ging wat schief! Hier geht's zur Online Karte: http://www.restaurant-tresor.de/ "
    });
  }
})

app.listen(app.get('port'), function () {
  console.log("Node app is running at localhost:" + app.get('port'))
})
