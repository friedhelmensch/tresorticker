const fetch = require("node-fetch");
var express = require('express');
var app = express();
const helper = require('./helper');
const executer = require('./executer');

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))

app.post('/', function (request, response) {
  
  executer.execute(fetch, response, helper);

})

app.listen(app.get('port'), function () {
  console.log("Node app is running at localhost:" + app.get('port'))
})
