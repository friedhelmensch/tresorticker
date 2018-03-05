const fetch = require("node-fetch");
var express = require('express');
var app = express();
const helper = require('./helper');
const menuProvider = require('./menuProvider');

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))

app.post('/', async function (request, response) {

  response.setHeader('Content-Type', 'application/json');

  try {
    const todaysMeals = await menuProvider.getTodaysMeals(fetch, helper);
    
    let message = "Heute beim Tresor: \n\n";
    todaysMeals.map(x => x.meals.map(m => message += m.meal + ' € ' + m.priceInEUR.replace('.', ',') + '\n'))

    response.send({
      response_type: "in_channel",
      text: message
    });

  } catch (e) {
    response.send({
      response_type: "ephemeral",
      text: "something went wrong: " + e.message
    });
  }
})

app.listen(app.get('port'), function () {
  console.log("Node app is running at localhost:" + app.get('port'))
})
