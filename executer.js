PDFParser = require("pdf2json");

exports.execute = async function (fetch, response, helper) {
    const menuResponse = await fetch("http://www.restaurant-tresor.de/index_htm_files/Wochenkarte.pdf");
    var menuBuffer = await menuResponse.buffer();
    parsePDFAndRespond(menuBuffer,response, helper)
}

parsePDFAndRespond = function (menuBuffer, response, helper)
{
    var pdfParser = new PDFParser(this, 1);
    pdfParser.on("pdfParser_dataError", async function (errData) {
        response.send(JSON.stringify({
            "response_type": "ephemeral",
            "text": result.errorMessage
        }));
    });

    pdfParser.on("pdfParser_dataReady", async function (pdfData) {

        var pdfAsText = pdfParser.getRawTextContent();
        var menu = helper.getMenu(pdfAsText);
        var today = helper.getDay(new Date().getDay());
        var todaysMeals = helper.extract(menu, today);

        response.setHeader('Content-Type', 'application/json');
        response.send(JSON.stringify({
            "response_type": "in_channel",
            "text": todaysMeals
        }));
    });
    pdfParser.parseBuffer(menuBuffer);
}