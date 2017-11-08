fs = require('fs');
PDFParser = require("pdf2json");
var http = require('http');
var express = require('express');
var app = express();
const helper = require('./helper');

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))

app.post('/', function (request, response) {
  var file = fs.createWriteStream("./WochenKarte2.pdf");
  var request = http.get("http://www.restaurant-tresor.de/index_htm_files/Wochenkarte.pdf", function (responsePdf) {
    var stream = responsePdf.pipe(file);
    stream.on("finish", function () {
      var pdfParser = new PDFParser(this, 1);
      pdfParser.on("pdfParser_dataError", errData => {
        console.error(errData.parserError)
      }
      );
      pdfParser.on("pdfParser_dataReady", function (pdfData) {
        var pdfAsText = pdfParser.getRawTextContent();
        var splitted = pdfAsText.split(/\n/g);
        var menu = [];
        splitted.forEach(function (element) {
          if (element != " \r") {
            menu.push(element.replace(" \r", ""));
          }
        }, this);

        var today = helper.getToday(new Date().getDay());
        var result = helper.extract(menu, today);
        
        response.setHeader('Content-Type', 'application/json');
        response.send(JSON.stringify({
          "response_type": "in_channel",
          "text": result
        }));
      });
      pdfParser.loadPDF("./WochenKarte2.pdf");
    })
  });
})

app.listen(app.get('port'), function () {
  console.log("Node app is running at localhost:" + app.get('port'))
})
