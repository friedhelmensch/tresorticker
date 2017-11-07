fs = require('fs'),
PDFParser = require("pdf2json");
var http = require('http');
var express = require('express')
var app = express()

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))

app.get('/', function (request, response) {
  var file = fs.createWriteStream("./WochenKarte2.pdf");
  var request = http.get("http://www.restaurant-tresor.de/index_htm_files/Wochenkarte.pdf", function (responsePdf) {
    var stream = responsePdf.pipe(file);
    stream.on("finish", function () {
      var pdfParser = new PDFParser(this, 1);
      pdfParser.on("pdfParser_dataError", errData => {
        console.error(errData.parserError)
      }
      );
      pdfParser.on("pdfParser_dataReady", function(pdfData) {
        //console.log(pdfParser.getRawTextContent());
        response.send(pdfParser.getRawTextContent())
      });
      pdfParser.loadPDF("./WochenKarte2.pdf");
    })
  });
})

app.listen(app.get('port'), function () {
  console.log("Node app is running at localhost:" + app.get('port'))
})
