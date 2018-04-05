PDFParser = require("pdf2json");
const LocalDate = require('js-joda').LocalDate;

exports.getTodaysMeals = async function (fetch) {
    const menuResponse = await fetch("http://www.restaurant-tresor.de/index_htm_files/Wochenkarte.pdf");
    const menuBuffer = await menuResponse.buffer();
    const pdfAsText = await getPdfAsText(menuBuffer);
    const todaysMeals = exports.getMenuByDay(LocalDate.now(), pdfAsText);
    return todaysMeals;
}

exports.getMenuByDay = function (date, textMenu) {
    const weekleMenu = exports.getMenu(textMenu);
    const todaysMenu = weekleMenu.filter(f => f.day == date.toString() | f.day == 'Täglich')
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
    
    const menuSectionByDay = allSeperators.slice(1)

    const weekRangeRegEx = /\d{1,2}. (Januar?|Februar?|März?|April?|Mai|Juni?|Juli?|August?|September?|Oktober?|November?|Dezember?) bis/g
    const monthNames = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
    const dayAndMonth = mealsText
      .match(weekRangeRegEx)[0]
      .replace('bis', '')
      .replace(' ', '')
      .trim()
      .split('.')

    const firstDayInMenu = LocalDate.of(new Date().getFullYear(), monthNames.indexOf(dayAndMonth[1].trim()) + 1, dayAndMonth[0]);
    const firstDayOfMenuWeek = firstDayInMenu.minusDays(firstDayInMenu.dayOfWeek().ordinal());

    const weeklyMenu = menuSectionByDay.reduce((menu, current, idx) => {
        const sectionMenu = menuSections[idx].trim()
            .split(/(\r\n|\n|\r)/gm)
            .filter(r => r !== '\r\n')
            .filter(r => r !== '\n')
            .map(m => {
                const menuPriceMap = m.split('€')
                let menuText = m;
                if(menuPriceMap[0] !== undefined && menuPriceMap[1] !== undefined) {
                    menuText = menuPriceMap[0].trim() + ' € ' + parseFloat(menuPriceMap[1].replace(/,/, '.')).toFixed(2).replace('.',',');
                }

                return menuText;
            })

        const day = current !== 'Täglich' ? firstDayOfMenuWeek.plusDays(idx).toString() : 'Täglich'
        menu.push({'day': day, 'meals':sectionMenu})

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