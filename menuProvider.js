PDFParser = require("pdf2json");

exports.getTodaysMeals = async function (fetch, helper) {
    const menuResponse = await fetch("http://www.restaurant-tresor.de/index_htm_files/Wochenkarte.pdf");
    const menuBuffer = await menuResponse.buffer();
    const pdfAsText = await getPdfAsText(menuBuffer);
    const todaysMeals = exports.getMenuByDay(new Date(), pdfAsText, helper);
    return todaysMeals;
}

exports.getMenuByDay = function (date, textMenu, helper) {
    const weekleMenu = exports.getMenu(textMenu);

    const today = helper.getDay(date.getDay());
    const todaysMenu = weekleMenu.filter(f => f.day == today | f.day == 'Täglich')
    return todaysMenu;
}

exports.getMenu = function (textMenu) {
    const mealsText = textMenu
        .replace(/(\r\n |\n |\r )/gm, '')
        .replace('Wochenkarte', '')
        .replace('----------------Page (0) Break----------------', '')
        .trim();

    const allSeperators = ['Wochenkarte', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Täglich']

    const menuSections = mealsText.split(new RegExp(allSeperators.join('|'), 'g')).slice(1)
    
    const menuSeperators = allSeperators.slice(1)

    const weeklyMenu = menuSeperators.reduce((menu, current, idx) => {
        const sectionMenu = menuSections[idx].trim()
            .split(/(\r\n|\n|\r)/gm)
            .filter(r => r !== '\r\n')
            .map(m => {
                const menuPriceMap = m.split('€')
                return {
                    "meal": menuPriceMap[0].trim(),
                    "priceInEUR": parseFloat(menuPriceMap[1].replace(/,/, '.')).toFixed(2)
                }
            })

        menu.push({'day': current, 'meals':sectionMenu})

        return menu;
    }, []);

    return weeklyMenu;
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