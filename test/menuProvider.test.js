'use strict'

const menuProvider = require('../menuProvider');
const expect = require('chai').expect

it('Parsing the text representation of Wochenkarte should create menu', () => {
  const fs = require('fs')

  const menuText = fs.readFileSync('./test/Wochenkarte.content.txt', 'utf8').replace(/(\r\n |\n |\r )/gm, "")
  const menu = menuProvider.getMenu(menuText)

  const expectedMenu = [{
      "day": "2018-02-26",
      "meals": [
        "Schupfnudelpfanne mit Sauerkraut und Kasseler € 7,50"
      ]
    },
    {
      "day": "2018-02-27",
      "meals": [
        "Gebratene Hähnchenbrust auf Gemüsereis und Magodip € 7,50"
      ]
    },
    {
      "day": "2018-02-28",
      "meals": [
      "Gefüllter Schweinehals mit Spätzle € 7,50"
      ]
    },
    {
      "day": "2018-03-01",
      "meals": [
        "Überbackenes Putensteak mit Tomate-Mozzarella und Wedges € 7,50"
      ]
    },
    {
      "day": "2018-03-02",
      "meals": [
        "Tilapiafilet mit Rosmarinkartoffeln € 7,50"
      ]
    },
    {
      "day": "Täglich",
      "meals": [
         "Salatteller mit Schinken und Ei € 7,20"
        ,"Spaghetti „Amatriciana“ mit Speck in Tomatensosse € 7,00"
        ,"Linseneintopf mit Saiten € 6,80"
      ]
    }
  ];

  expect(menu).to.deep.equal(expectedMenu);
})

it('GetMenu should return daily special as well as all week daily dishes', () => {
  const fs = require('fs')
  const LocalDate = require('js-joda').LocalDate;

  const menuText = fs.readFileSync('./test/Wochenkarte.content.txt', 'utf8').replace(/(\r\n |\n |\r )/gm, "")
  const todaysMenu = menuProvider.getMenuByDay(LocalDate.of(2018, 2, 26), menuText)

  const expectedDailyMenu = [{
      "day": "2018-02-26",
      "meals": [
        "Schupfnudelpfanne mit Sauerkraut und Kasseler € 7,50"
      ]
    },
    {
      "day": "Täglich",
      "meals": [
        "Salatteller mit Schinken und Ei € 7,20"
        ,"Spaghetti „Amatriciana“ mit Speck in Tomatensosse € 7,00"
        ,"Linseneintopf mit Saiten € 6,80"
      ]
    }
  ]

  expect(todaysMenu).to.deep.equal(expectedDailyMenu);
})

it('GetMenu should in weeks with holidays', () => {
  const fs = require('fs')
  const LocalDate = require('js-joda').LocalDate;

  const menuText = fs.readFileSync('./test/Wochenkarte.Feiertag.content.txt', 'utf8').replace(/(\r\n |\n |\r )/gm, "")
  const todaysMenu = menuProvider.getMenuByDay(LocalDate.of(2018, 3, 30), menuText)

  const expectedDailyMenu = [{
      "day": "2018-03-30",
      "meals": [
        "Feiertag"
      ]
    },
    {
      "day": "Täglich",
      "meals": [
        "Salatteller mit Mozzarellastiks 7,00"
        ,"Gebratener Leberkäse mit Zwiebelsosse und Pommes € 7,20"
        ,"Sauerbraten mit Spätzle und Blaukraut € 13,50"
      ]
    }
  ]

  expect(todaysMenu).to.deep.equal(expectedDailyMenu);
})

it('Extracting start date of weekly menu should return 26.02.2018', () => {
  const fs = require('fs')
  const LocalDate = require('js-joda').LocalDate;

  const menuText = fs.readFileSync('./test/Wochenkarte.content.txt', 'utf8').replace(/(\r\n |\n |\r )/gm, "")
  const weekRangeRegEx = /\d{1,2}. (Januar?|Februar?|März?|April?|Mai|Juni?|Juli?|August?|September?|Oktober?|November?|Dezember?) bis/g
  const monthNames = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
  const dayAndMonth = menuText
    .match(weekRangeRegEx)[0]
    .replace('bis', '')
    .replace(' ', '')
    .trim()
    .split('.')

  const startDate = LocalDate.of(new Date().getFullYear(), monthNames.indexOf(dayAndMonth[1].trim()) + 1, dayAndMonth[0])
  const expectedStartDate = LocalDate.of(2018, 2, 26)

  expect(expectedStartDate).to.deep.equal(startDate);
})