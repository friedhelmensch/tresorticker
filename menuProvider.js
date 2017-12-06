PDFParser = require("pdf2json");

exports.getTodaysMeals = async function (fetch, helper) {
    const menuResponse = await fetch("http://www.restaurant-tresor.de/index_htm_files/Wochenkarte.pdf");
    var menuBuffer = await menuResponse.buffer();

    var pdfAsText = await getPdfAsText(menuBuffer);

    var menu = helper.getMenu(pdfAsText);
    var today = helper.getDay(new Date().getDay());
    var todaysMeals = helper.extract(menu, today);
    return todaysMeals;
}

getPdfAsText = async function (menuBuffer) {

    return new Promise(function (resolve, reject) {
        var pdfParser = new PDFParser(this, 1);
        pdfParser.on("pdfParser_dataError", function (errData) {
            reject(errData);
        });

        pdfParser.on("pdfParser_dataReady", function (pdfData) {
            var pdfAsText = pdfParser.getRawTextContent();
            resolve(pdfAsText);
        });
        pdfParser.parseBuffer(menuBuffer);
    });
}